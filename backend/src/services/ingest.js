// services/ingest.js (CommonJS) ✅ FULL UPDATED (PDF.js)
const Bot = require("../modules/chats/bot.model");
const Chunk = require("../modules/chats/chunk.model");
const { crawlWebsite } = require("../utils/crawl");
const { chunkText } = require("../utils/chunk");
const { embedText } = require("../utils/embeddings");
const { extractPdfText } = require("../utils/pdfText");

const BATCH_SIZE = 100;
const MIN_CHUNK_LEN = 80;
const EMBED_CONCURRENCY = 2;

// -----------------------------
// Concurrency pool
// -----------------------------
async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let idx = 0;

  const workers = new Array(Math.min(concurrency, items.length))
    .fill(0)
    .map(async () => {
      while (true) {
        const current = idx++;
        if (current >= items.length) break;
        results[current] = await mapper(items[current], current);
      }
    });

  await Promise.all(workers);
  return results;
}

function uniqByText(chunks) {
  const seen = new Set();
  const out = [];
  for (const c of chunks) {
    const t = String(c || "").replace(/\s+/g, " ").trim();
    if (!t || t.length < MIN_CHUNK_LEN) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

async function insertBatch(docs) {
  if (!docs.length) return 0;
  try {
    await Chunk.insertMany(docs, { ordered: false });
    return docs.length;
  } catch (e) {
    console.error("Chunk.insertMany error:", e?.message || e);
    return 0;
  }
}

async function ingestBot(botId, { websiteUrl, pdfFiles }) {
  await Bot.findByIdAndUpdate(botId, {
    status: "processing",
    error: "",
    pagesCrawled: 0,
    chunksCount: 0,
    lastIngest: null,
    lastPdfError: "",
  });

  await Chunk.deleteMany({ botId });

  try {
    let totalChunks = 0;

    // -------------------------
    // WEBSITE
    // -------------------------
    let pages = [];
    try {
      pages = await crawlWebsite(websiteUrl, {
        maxPages: 25,
        maxDepth: 3,
        minTextLength: 200,
      });
    } catch (e) {
      console.error("crawlWebsite failed:", e?.message || e);
      pages = [];
    }

    await Bot.findByIdAndUpdate(botId, { pagesCrawled: pages.length }).catch(() => {});

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      await Bot.findByIdAndUpdate(botId, {
        $set: { lastIngest: { type: "website", current: i + 1, total: pages.length } },
      }).catch(() => {});

      const pieces = uniqByText(chunkText(page.text, 1200, 200));
      if (!pieces.length) continue;

      const embedded = await mapWithConcurrency(pieces, EMBED_CONCURRENCY, async (piece) => ({
        text: piece,
        embedding: await embedText(piece),
      }));

      let batch = [];
      for (const e of embedded) {
        if (!e?.embedding?.length) continue;

        batch.push({
          botId,
          sourceType: "website",
          source: page.url,
          meta: { url: page.url, title: page.title || "" },
          text: e.text,
          embedding: e.embedding,
        });

        if (batch.length >= BATCH_SIZE) {
          totalChunks += await insertBatch(batch);
          batch = [];
          await Bot.findByIdAndUpdate(botId, { chunksCount: totalChunks }).catch(() => {});
        }
      }

      if (batch.length) {
        totalChunks += await insertBatch(batch);
        await Bot.findByIdAndUpdate(botId, { chunksCount: totalChunks }).catch(() => {});
      }
    }

    // -------------------------
    // PDFs (✅ PDF.js)
    // -------------------------
    const pdfArr = Array.isArray(pdfFiles) ? pdfFiles : [];

    for (let p = 0; p < pdfArr.length; p++) {
      const file = pdfArr[p];

      await Bot.findByIdAndUpdate(botId, {
        $set: {
          lastIngest: { type: "pdf", current: p + 1, total: pdfArr.length, file: file.originalname },
          lastPdfError: "",
        },
      }).catch(() => {});

      if (!file?.buffer?.length) {
        await Bot.findByIdAndUpdate(botId, {
          $set: { lastPdfError: `PDF buffer missing for ${file.originalname}` },
        }).catch(() => {});
        continue;
      }

      let pdfText = "";
      try {
        pdfText = await extractPdfText(file.buffer);
      } catch (e) {
        await Bot.findByIdAndUpdate(botId, {
          $set: { lastPdfError: `PDF.js extract failed for ${file.originalname}: ${e?.message || e}` },
        }).catch(() => {});
        continue;
      }

      console.log("PDF:", file.originalname, "TEXT LEN:", pdfText.length);

      if (!pdfText || pdfText.trim().length < 50) {
        await Bot.findByIdAndUpdate(botId, {
          $set: { lastPdfError: `No readable text extracted from ${file.originalname}` },
        }).catch(() => {});
        continue;
      }

      const pieces = uniqByText(chunkText(pdfText, 1200, 200));
      console.log("PDF:", file.originalname, "CHUNKS:", pieces.length);

      if (!pieces.length) continue;

      const embedded = await mapWithConcurrency(pieces, EMBED_CONCURRENCY, async (piece) => ({
        text: piece,
        embedding: await embedText(piece),
      }));

      let batch = [];
      for (const e of embedded) {
        if (!e?.embedding?.length) continue;

        batch.push({
          botId,
          sourceType: "pdf",
          source: file.originalname,
          meta: { file: file.originalname },
          text: e.text,
          embedding: e.embedding,
        });

        if (batch.length >= BATCH_SIZE) {
          totalChunks += await insertBatch(batch);
          batch = [];
          await Bot.findByIdAndUpdate(botId, { chunksCount: totalChunks }).catch(() => {});
        }
      }

      if (batch.length) {
        totalChunks += await insertBatch(batch);
        await Bot.findByIdAndUpdate(botId, { chunksCount: totalChunks }).catch(() => {});
      }
    }

    // ✅ never set ready if 0
    if (totalChunks === 0) {
      await Bot.findByIdAndUpdate(botId, {
        status: "error",
        error:
          "Ingestion finished but no content was extracted (0 chunks). PDFs were received but text extraction failed. Check lastPdfError.",
        chunksCount: 0,
      });
      return { ok: false, message: "0 chunks extracted", pages: pages.length, chunks: 0 };
    }

    await Bot.findByIdAndUpdate(botId, {
      status: "ready",
      chunksCount: totalChunks,
      error: "",
      $set: { lastIngest: { type: "done", current: 1, total: 1 } },
    });

    return { ok: true, pages: pages.length, chunks: totalChunks };
  } catch (err) {
    await Bot.findByIdAndUpdate(botId, {
      status: "error",
      error: err.message || "Ingestion failed",
    });
    return { ok: false, message: err.message || "Ingestion failed" };
  }
}

module.exports = { ingestBot };
