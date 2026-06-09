// Redis client configuration boilerplate
let redisClient = null;

const connectRedis = () => {
  if (process.env.REDIS_URL) {
    try {
      const Redis = require('ioredis');
      redisClient = new Redis(process.env.REDIS_URL);
      console.log("Redis Connected Successfully");
    } catch (err) {
      console.error("Redis Connection Error:", err);
    }
  } else {
    console.warn("REDIS_URL not configured. Redis caching disabled.");
  }
};

const getRedisClient = () => redisClient;

module.exports = {
  connectRedis,
  getRedisClient
};
