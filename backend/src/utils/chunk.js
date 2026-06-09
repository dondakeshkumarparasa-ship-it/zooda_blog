// backend/lib/chunk.js ✅ FULL UPDATED (same logic + stronger cleanup)
function chunkText(text, maxChars = 1200, overlap = 200) {
  const clean = String(text || "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  const chunks = [];
  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + maxChars, clean.length);
    const piece = clean.slice(start, end).trim();

    if (piece.length > 120) chunks.push(piece);

    if (end === clean.length) break;

    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}

module.exports = { chunkText };