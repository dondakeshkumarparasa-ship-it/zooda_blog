const mongoose = require("mongoose");

const AiSettingSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "openrouter" }, // openrouter, openai, gemini, deepseek, custom
    apiKey: { type: String, default: "" },
    model: { type: String, default: "google/gemini-2.5-flash" },
    customBaseUrl: { type: String, default: "" },
    systemPrompt: { type: String, default: "You are a helpful AI assistant for the business. Answer the customer's question based on the retrieved business context." }
  },
  { timestamps: true }
);

module.exports = mongoose.models.AiSetting || mongoose.model("AiSetting", AiSettingSchema);
