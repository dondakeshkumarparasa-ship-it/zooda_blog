const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Standard media upload to Cloudinary (for posts, products, promotions)
const cloudinaryUpload = multer({ storage });

// PDF uploads for bot setups (memory storage)
const pdfMemoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      String(file.originalname || "").toLowerCase().endsWith(".pdf");
    if (!ok) return cb(new Error("Only PDF files are allowed"));
    cb(null, true);
  },
});

module.exports = {
  cloudinaryUpload,
  pdfMemoryUpload
};
