const express = require('express');
const { createProduct, getProductByBusiness, updateProduct, deleteProduct } = require('./product.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { cloudinaryUpload } = require('../../middleware/upload.middleware');
const router = express.Router();

router.post('/products', authMiddleware, cloudinaryUpload.single('image'), createProduct);
router.get('/product/:businessId', getProductByBusiness);
router.get('/businesses/:businessId/products', getProductByBusiness);
router.put('/products/:id', cloudinaryUpload.single('image'), updateProduct);
router.delete('/product/:productId', deleteProduct);

module.exports = router;
