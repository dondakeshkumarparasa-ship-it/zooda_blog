const express = require('express');
const {
  createPromotion,
  getPromotionsByBusiness,
  getActivePromotions,
  deletePromotion,
  getSinglePromotion,
  getCompanyPromotions,
  updatePromotion,
  trackPromotion
} = require('./promotion.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { cloudinaryUpload } = require('../../middleware/upload.middleware');
const router = express.Router();

router.post('/promotions', authMiddleware, cloudinaryUpload.single('image'), createPromotion);
router.get('/promotions/:businessId', getPromotionsByBusiness);
router.get('/businesses/:businessId/promotions', getPromotionsByBusiness);
router.get('/promotion', getActivePromotions);
router.delete('/promotions/:id', authMiddleware, deletePromotion);
router.get('/promotions', getSinglePromotion);
router.get('/promotions/company/:businessId', getCompanyPromotions);
router.put('/promotions/:id', cloudinaryUpload.single('image'), updatePromotion);
router.post('/promotion/:id/track', trackPromotion);

module.exports = router;
