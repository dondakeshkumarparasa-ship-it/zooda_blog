const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, default: null },
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  mediaMetadata: {
    filename: String,
    originalName: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  },
  platforms: [{ type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin'] }],
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'published', 'failed'], 
    default: 'draft' 
  },
  scheduledFor: { type: Date, default: null },
  likesList: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
    }
  ],
  likesCount: { type: Number, default: 0 },
  commentsList: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  commentsCount: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  tags: [String],
  category: { type: String, default: 'General' },
  caption: { type: String, default: '' }
}, { 
  timestamps: true
});

PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ business: 1, status: 1 });
PostSchema.index({ scheduledFor: 1 });
PostSchema.index({ tags: 1 });

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
