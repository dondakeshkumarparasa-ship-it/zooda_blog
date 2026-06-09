const mongoose = require("mongoose");

const BotSchema = new mongoose.Schema(
  {
    businessId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Business", 
      required: true 
    },
    businessName: { type: String, required: true },
    websiteUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ["idle", "processing", "ready", "error"],
      default: "idle",
    },
    error: { type: String, default: "" },

    pagesCrawled: { type: Number, default: 0 },
    chunksCount: { type: Number, default: 0 },

    lastIngest: { type: Object, default: null },
    lastPdfError: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Bot || mongoose.model("Bot", BotSchema);
