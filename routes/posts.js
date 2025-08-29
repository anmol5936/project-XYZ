const express = require('express');
const Post = require('../models/Post');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all posts for the feed (sorted by creation date, newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 most recent posts
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { type, title, description, author, authorId, originalPrompt, ...typeSpecificData } = req.body;

    if (!type || !title || !description || !author || !authorId || !originalPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const postData = {
      type,
      title,
      description,
      author,
      authorId,
      originalPrompt
    };

    // Add type-specific data
    if (type === 'event' && typeSpecificData.eventDetails) {
      postData.eventDetails = {
        location: typeSpecificData.eventDetails.location,
        date: typeSpecificData.eventDetails.date,
        rsvp: {
          going: [],
          interested: [],
          notGoing: []
        }
      };
    } else if (type === 'lostfound' && typeSpecificData.lostFoundDetails) {
      postData.lostFoundDetails = typeSpecificData.lostFoundDetails;
    } else if (type === 'announcement' && typeSpecificData.announcementDetails) {
      postData.announcementDetails = typeSpecificData.announcementDetails;
    }

    const post = new Post(postData);
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only allow the author to update their post
    if (post.authorId !== req.body.authorId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Add reaction to a post
router.post('/:id/reactions', async (req, res) => {
  try {
    const { type, userId } = req.body;
    
    if (!type || !userId) {
      return res.status(400).json({ error: 'Reaction type and userId are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Remove any existing reaction from this user
    post.reactions = post.reactions.filter(reaction => reaction.userId !== userId);
    
    // Add new reaction
    post.reactions.push({ type, userId });
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Add comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { content, author, authorId } = req.body;
    
    if (!content || !author || !authorId) {
      return res.status(400).json({ error: 'Content, author, and authorId are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      id: uuidv4(),
      content,
      author,
      authorId,
      reactions: [],
      replies: []
    };

    post.comments.push(comment);
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Add reply to a comment
router.post('/:id/comments/:commentId/replies', async (req, res) => {
  try {
    const { content, author, authorId } = req.body;
    
    if (!content || !author || !authorId) {
      return res.status(400).json({ error: 'Content, author, and authorId are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.find(c => c.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = {
      id: uuidv4(),
      content,
      author,
      authorId,
      reactions: []
    };

    comment.replies.push(reply);
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// RSVP to an event
router.post('/:id/rsvp', async (req, res) => {
  try {
    const { response, userId, name } = req.body; // response: 'going', 'interested', 'notGoing'
    
    if (!response || !userId || !name) {
      return res.status(400).json({ error: 'Response, userId, and name are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post || post.type !== 'event') {
      return res.status(404).json({ error: 'Event post not found' });
    }

    if (!post.eventDetails) {
      post.eventDetails = { rsvp: { going: [], interested: [], notGoing: [] } };
    }

    const rsvp = post.eventDetails.rsvp;
    
    // Remove user from all RSVP lists first
    ['going', 'interested', 'notGoing'].forEach(type => {
      rsvp[type] = rsvp[type].filter(user => user.userId !== userId);
    });

    // Add user to the appropriate list
    rsvp[response].push({ userId, name });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ error: 'Failed to update RSVP' });
  }
});

module.exports = router;
