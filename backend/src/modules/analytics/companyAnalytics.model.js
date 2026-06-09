const mongoose = require('mongoose');

const companyAnalyticsSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business", // pointing to Business model
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["impression", "click"],
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

companyAnalyticsSchema.index({ companyId: 1, createdAt: -1 });
companyAnalyticsSchema.index({ companyId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.models.CompanyAnalytics || mongoose.model("CompanyAnalytics", companyAnalyticsSchema);
