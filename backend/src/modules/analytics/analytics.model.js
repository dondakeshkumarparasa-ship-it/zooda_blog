const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  period: { 
    type: String, 
    required: true, 
    enum: ['daily', 'weekly', 'monthly'] 
  },
  date: { type: Date, required: true },
  followers: {
    total: { type: Number, default: 0 },
    growth: { type: Number, default: 0 }
  },
  engagement: {
    rate: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  reach: {
    total: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    paid: { type: Number, default: 0 }
  },
  sales: {
    revenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
