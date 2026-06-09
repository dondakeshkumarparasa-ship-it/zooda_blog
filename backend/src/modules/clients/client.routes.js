const express = require('express');
const {
  register,
  login,
  checkEmail,
  getProfile,
  syncWordpressProduct,
  syncWordpressProductsBulk,
  syncWoocommercePull,
  syncShopifyPull,
  syncCustomProduct,
  deleteSyncedProduct,
  resetPassword
} = require('./client.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/check-email', checkEmail);
router.post('/auth/reset-password', resetPassword);
router.get('/client', authMiddleware, getProfile);
router.post('/client/sync-wordpress-product', syncWordpressProduct);
router.post('/client/sync-wordpress-products-bulk', syncWordpressProductsBulk);
router.post('/client/sync-woocommerce-pull', syncWoocommercePull);
router.post('/client/sync-shopify-pull', syncShopifyPull);
router.post('/client/sync-custom-product', syncCustomProduct);
router.post('/client/sync-product-delete', deleteSyncedProduct);

module.exports = router;
