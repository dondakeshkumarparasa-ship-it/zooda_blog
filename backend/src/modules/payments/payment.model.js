const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
