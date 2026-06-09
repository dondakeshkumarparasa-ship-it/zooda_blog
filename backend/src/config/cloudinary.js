const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dguxtvyut",
  api_key: process.env.CLOUDINARY_API_KEY || "952138336163551",
  api_secret: process.env.CLOUDINARY_API_SECRET || "ppFNE2zTSuTPotEZcemJ_on7iHg",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

module.exports = {
  cloudinary,
  storage
};
