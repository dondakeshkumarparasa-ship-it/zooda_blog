module.exports = {
  MIN_SCORE: Number(process.env.CHAT_MIN_SCORE || 0.30),
  DEFAULT_UA: "Mozilla/5.0 (ZoodaBot/1.0)",
  BATCH_SIZE: 100,
  MIN_CHUNK_LEN: 80,
  EMBED_CONCURRENCY: 2
};
