const express = require('express');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get or create user session (no login required as per guidelines)
router.post('/session', async (req, res) => {
  try {
    const { name, sessionId } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    let user;

    // If sessionId provided, try to find existing user
    if (sessionId) {
      user = await User.findOne({ sessionId, isActive: true });
      
      if (user) {
        // Update last active timestamp
        user.lastActive = new Date();
        await user.save();
        
        // Set cookie and return user
        res.cookie('sessionId', user.sessionId, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: 'lax'
        });
        
        return res.json({
          userId: user.userId,
          name: user.name,
          sessionId: user.sessionId
        });
      }
    }

    // Create new user session
    const newSessionId = uuidv4();
    user = new User({
      name: name.trim(),
      sessionId: newSessionId
    });

    await user.save();

    // Set cookie
    res.cookie('sessionId', user.sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax'
    });

    res.status(201).json({
      userId: user.userId,
      name: user.name,
      sessionId: user.sessionId
    });

  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get current user from session
router.get('/me', async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({ error: 'No session found' });
    }

    const user = await User.findOne({ sessionId, isActive: true });

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    res.json({
      userId: user.userId,
      name: user.name,
      sessionId: user.sessionId
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user name
router.put('/me', async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    const { name } = req.body;

    if (!sessionId) {
      return res.status(401).json({ error: 'No session found' });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await User.findOne({ sessionId, isActive: true });

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    user.name = name.trim();
    user.lastActive = new Date();
    await user.save();

    res.json({
      userId: user.userId,
      name: user.name,
      sessionId: user.sessionId
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// End session (logout)
router.post('/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      // Optionally mark user as inactive instead of deleting
      await User.findOneAndUpdate(
        { sessionId },
        { isActive: false }
      );
    }

    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Get all active users (for development/debugging)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('userId name createdAt lastActive')
      .sort({ lastActive: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;
