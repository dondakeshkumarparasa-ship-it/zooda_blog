const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["general"],
      required: true,
    },
    link: {
      type: String,
    },
    displayType: {
      type: String,
      enum: ["banner", "popup"],
      default: "banner",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "scheduled", "paused", "expired", "draft"],
      default: "draft",
    },
    image: { type: String },
    performance: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PromotionSchema.virtual("isActive").get(function () {
  return this.status === "active";
});

module.exports = mongoose.models.Promotion || mongoose.model("Promotion", PromotionSchema);
