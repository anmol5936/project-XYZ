const mongoose = require('mongoose');

// Base Post Schema with common fields
const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'lostfound', 'announcement'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  originalPrompt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  reactions: [{
    type: {
      type: String,
      enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
    },
    userId: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    id: {
      type: String,
      required: true
    },
    content: String,
    author: String,
    authorId: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    reactions: [{
      type: {
        type: String,
        enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
      },
      userId: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      id: String,
      content: String,
      author: String,
      authorId: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      reactions: [{
        type: {
          type: String,
          enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
        },
        userId: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }]
    }]
  }]
});

// Event-specific fields
postSchema.add({
  eventDetails: {
    location: String,
    date: Date,
    rsvp: {
      going: [{
        userId: String,
        name: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      interested: [{
        userId: String,
        name: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      notGoing: [{
        userId: String,
        name: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }]
    }
  }
});

// Lost & Found specific fields
postSchema.add({
  lostFoundDetails: {
    itemType: {
      type: String,
      enum: ['lost', 'found']
    },
    location: String,
    imageUrl: String,
    contactInfo: String
  }
});

// Announcement specific fields
postSchema.add({
  announcementDetails: {
    department: String,
    attachmentUrl: String,
    attachmentType: {
      type: String,
      enum: ['image', 'pdf']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }
});

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for reaction counts
postSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.type] = (counts[reaction.type] || 0) + 1;
  });
  return counts;
});

// Ensure virtuals are included in JSON output
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
