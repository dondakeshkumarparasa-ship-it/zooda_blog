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
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Setup static public/sdk directory
const sdkDir = path.join(__dirname, '../public/sdk');
if (!fs.existsSync(sdkDir)) {
  fs.mkdirSync(sdkDir, { recursive: true });
}
app.use('/sdk', express.static(sdkDir));

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
