const axios = require('axios');
const AiSetting = require('../modules/chats/aiSetting.model');
const TokenUsage = require('../modules/chats/tokenUsage.model');

async function callLlm(prompt, systemPrompt) {
  try {
    const setting = await AiSetting.findOne();
    if (!setting || !setting.apiKey) {
      console.warn("No AI API Key configured in Admin Settings.");
      return { text: null, usage: null };
    }

    let baseUrl = "";
    if (setting.provider === "openrouter") {
      baseUrl = "https://openrouter.ai/api/v1";
    } else if (setting.provider === "openai") {
      baseUrl = "https://api.openai.com/v1";
    } else if (setting.provider === "gemini") {
      baseUrl = "https://generativelanguage.googleapis.com/v1beta/openai";
    } else if (setting.provider === "deepseek") {
      baseUrl = "https://api.deepseek.com";
    } else if (setting.provider === "custom") {
      baseUrl = setting.customBaseUrl;
    }

    // Clean trailing slash
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const payload = {
      model: setting.model,
      messages: [
        { role: "system", content: systemPrompt || setting.systemPrompt },
        { role: "user", content: prompt }
      ]
    };

    const response = await axios.post(`${baseUrl}/chat/completions`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${setting.apiKey}`
      },
      timeout: 15000
    });

    const choice = response.data.choices?.[0];
    const text = choice?.message?.content || "";
    const usage = response.data.usage || null;

    if (usage) {
      const today = new Date().toISOString().split('T')[0];
      await TokenUsage.findOneAndUpdate(
        { date: today },
        {
          $inc: {
            promptTokens: usage.prompt_tokens || 0,
            completionTokens: usage.completion_tokens || 0,
            totalTokens: usage.total_tokens || ((usage.prompt_tokens || 0) + (usage.completion_tokens || 0)) || 0
          }
        },
        { upsert: true, new: true }
      );
    }

    return { text, usage };
  } catch (error) {
    console.error("LLM call failed:", error.response?.data || error.message);
    return { text: null, error: error.message };
  }
}

module.exports = {
  callLlm
};
