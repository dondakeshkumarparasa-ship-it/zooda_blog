require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { apiRouter } = require('./routes/index');
const { resetPasswordDirect } = require('./modules/auth/auth.controller');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup static uploads directory
const uploadDir = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create local uploads directory (read-only filesystem):", err.message);
}
app.use('/uploads', express.static(uploadDir));

// Setup static public/sdk directory
const sdkDir = path.join(__dirname, '../public/sdk');
try {
  if (!fs.existsSync(sdkDir)) {
    fs.mkdirSync(sdkDir, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create public/sdk directory (read-only filesystem):", err.message);
}
app.use('/sdk', express.static(sdkDir));

// Database connection middleware to ensure connection before handling routes (especially in serverless contexts)
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.error("Database connection error in middleware:", err);
      return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
  }
  next();
});

// Mount routes
app.use('/api', apiRouter);


// Mount non-prefixed root routes
app.post('/reset-password-direct', resetPasswordDirect);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
