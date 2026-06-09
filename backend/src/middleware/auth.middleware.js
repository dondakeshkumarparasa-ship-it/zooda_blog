const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Auth middleware for User/Admin (used in /api/posts, /api/products, etc.)
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    const secret = process.env.JWT_SECRET || 'BANNU9';
    const decoded = jwt.verify(token, secret);
    
    // Dynamically require User model to avoid circular dependency
    const User = require('../modules/auth/auth.model');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Auth middleware for Client/Guest (used in /api/chat, /api/chats/customer/send, etc.)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    // Support guest/anonymous users
    if (token.startsWith('guest_')) {
      const guestIdStr = token.replace('guest_', '');
      if (/^[0-9a-fA-F]{24}$/.test(guestIdStr)) {
        req.user = {
          _id: new mongoose.Types.ObjectId(guestIdStr),
          name: 'Guest User',
          email: 'guest@zooda.in',
          isGuest: true
        };
        return next();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid guest session identifier'
        });
      }
    }

    const secret = process.env.JWT_SECRET || 'BANNU9';
    const decoded = jwt.verify(token, secret);

    const Client = require('../modules/clients/client.model');
    const user = await Client.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

module.exports = {
  authMiddleware,
  auth
};
