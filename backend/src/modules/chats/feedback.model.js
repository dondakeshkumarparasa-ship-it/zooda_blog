const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
