const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
