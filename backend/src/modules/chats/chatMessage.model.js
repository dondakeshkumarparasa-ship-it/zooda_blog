const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Point to Client model
    required: true,
    index: true
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

chatMessageSchema.index({ user: 1, business: 1, timestamp: 1 });

module.exports = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
