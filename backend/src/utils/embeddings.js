// backend/lib/embeddings.js ✅ FULL UPDATED (safe + stable)
const { pipeline } = require("@xenova/transformers");

let embedderPromise = null;

// Loads once (downloads model files on first run)
async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
}

async function embedText(text) {
  const embedder = await getEmbedder();
  const input = String(text || "").replace(/\s+/g, " ").trim();
  const out = await embedder(input, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}

// vectors are normalized -> cosine similarity ~ dot product
function cosineSim(a, b) {
  let sum = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) sum += a[i] * b[i];
  return sum;
}

module.exports = { embedText, cosineSim };