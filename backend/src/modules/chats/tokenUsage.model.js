const mongoose = require("mongoose");

const TokenUsageSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.models.TokenUsage || mongoose.model("TokenUsage", TokenUsageSchema);
