const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true, trim: true },
  productLink: { type: String, default: null },
  price: { type: Number, required: true, min: 0 },
  sku: { type: String, unique: true },
  description: { type: String, default: '' },
  tags: {
    type: [String],
    default: []
  },
  image: {
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  },
  isActive: { type: Boolean, default: true },
  sales: {
    totalSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, { timestamps: true });

ProductSchema.pre('save', function (next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
