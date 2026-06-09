const app = require('../src/app');
const connectDatabase = require('../src/config/database');

let isConnected = false;

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (err) {
      console.error("Database connection error in Vercel function:", err);
      return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
  }
  next();
});

module.exports = app;
