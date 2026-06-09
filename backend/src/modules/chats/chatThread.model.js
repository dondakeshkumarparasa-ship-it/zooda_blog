const mongoose = require('mongoose');

const ChatThreadSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true,
    index: true
  },
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business', 
    required: true,
    index: true
  },
  isAiActive: { 
    type: Boolean, 
    default: true 
  },
  lastMessageText: { 
    type: String, 
    default: "" 
  },
  lastMessageSender: { 
    type: String, 
    enum: ['user', 'ai', 'business'], 
    default: 'user' 
  },
  lastMessageTimestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, { timestamps: true });

ChatThreadSchema.index({ user: 1, business: 1 }, { unique: true });

module.exports = mongoose.models.ChatThread || mongoose.model('ChatThread', ChatThreadSchema);
