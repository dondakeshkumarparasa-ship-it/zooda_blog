import { useState, useEffect } from "react";
import { Cpu, Save, Calendar, Sparkles, RefreshCw } from "lucide-react";

interface AdminAiSettingsTabProps {
  makeAPIRequest: (endpoint: string, options?: RequestInit) => Promise<{ success: boolean; data?: any; error?: string }>;
}

export function AdminAiSettingsTab({ makeAPIRequest }: AdminAiSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Settings states
  const [provider, setProvider] = useState("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("google/gemini-2.5-flash");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);

  // Stats/Logs states
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const result = await makeAPIRequest("/admin/ai-settings");
    if (result.success && result.data) {
      setProvider(result.data.provider);
      setApiKey(result.data.apiKey);
      setModel(result.data.model);
      setCustomBaseUrl(result.data.customBaseUrl || "");
      setSystemPrompt(result.data.systemPrompt || "");
      setHasApiKey(result.data.hasApiKey);
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    const result = await makeAPIRequest("/admin/ai-tokens");
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setLoadingLogs(false);
  };

  useEffect(() => {
    fetchSettings();
    fetchLogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await makeAPIRequest("/admin/ai-settings", {
      method: "POST",
      body: JSON.stringify({
        provider,
        apiKey,
        model,
        customBaseUrl,
        systemPrompt
      })
    });
    setSaving(false);
    if (result.success) {
      alert("AI Settings saved successfully!");
      fetchSettings(); // Refresh settings to show masked api key
    } else {
      alert("Failed to save settings: " + result.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-foreground">AI Configuration & Token Tracker</h2>
        <p className="text-sm text-muted-foreground">Manage global AI API credentials and track daily token consumption.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Configuration Card */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">API Connection Credentials</h3>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">LLM API Provider</label>
                <select
                  value={provider}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProvider(val);
                    // Autofill model defaults
                    if (val === "openrouter") setModel("google/gemini-2.5-flash");
                    else if (val === "openai") setModel("gpt-4o-mini");
                    else if (val === "gemini") setModel("gemini-2.5-flash");
                    else if (val === "deepseek") setModel("deepseek-chat");
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-800"
                >
                  <option value="openrouter">OpenRouter (Base: https://openrouter.ai/api/v1)</option>
                  <option value="gemini">Google Gemini API (Base: https://generativelanguage.googleapis.com/...)</option>
                  <option value="openai">ChatGPT / OpenAI API (Base: https://api.openai.com/v1)</option>
                  <option value="deepseek">DeepSeek AI API (Base: https://api.deepseek.com)</option>
                  <option value="custom">Custom API Base URL (OpenAI-compatible)</option>
                </select>
              </div>

              {provider === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Custom Base URL</label>
                  <input
                    type="url"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://your-custom-endpoint.com/v1"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  API Authorization Key 
                  {hasApiKey && <span className="ml-2 text-xs text-success font-semibold">(Configured)</span>}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={hasApiKey ? "••••••••••••••••" : "Paste your API secret key here"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Model Name Identifier</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. google/gemini-2.5-flash"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">System Instruction Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary text-slate-800 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/95 disabled:opacity-60 transition-all shadow-md shadow-primary/10"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Configuration..." : "Save AI Credentials"}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Token Tracker Logs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Sparkles className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Token Tracker Logs</h3>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loadingLogs}
              className="p-2 rounded-lg bg-slate-50 border border-border hover:bg-slate-100 text-slate-600 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loadingLogs ? "animate-spin" : ""}`} />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Token usage is aggregated per calendar day. Showing usage stats for the last 30 active days.
          </p>

          <div className="flex-1 overflow-y-auto max-h-[360px] scrollbar-thin border border-border rounded-xl">
            {loadingLogs ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-success"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">No token logs recorded yet.</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Prompt</th>
                    <th className="p-3 text-right">Completion</th>
                    <th className="p-3 text-right font-bold text-slate-800">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-600 font-medium">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold flex items-center gap-1.5 text-slate-800 text-left">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {log.date}
                      </td>
                      <td className="p-3 text-right font-mono">{log.promptTokens.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{log.promptTokens ? log.completionTokens.toLocaleString() : "0"}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#15A148]">
                        {log.totalTokens.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
