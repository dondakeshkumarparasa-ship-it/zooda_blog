const express = require('express');
const {
  getBusinesses,
  approveBusiness,
  rejectBusiness,
  suspendBusiness,
  activateBusiness,
  getStats,
  getAnalyticsBusinesses,
  deleteBusiness,
  updateBusiness,
  deleteBusinessPost,
  deleteBusinessProduct,
  deleteBusinessPromotion,
  getBusinessAnalytics
} = require('./admin.controller');

const router = express.Router();

router.get('/admin/businesses', getBusinesses);
router.put('/admin/businesses/:businessId/approve', approveBusiness);
router.put('/admin/businesses/:businessId/reject', rejectBusiness);
router.put('/admin/businesses/:businessId/suspend', suspendBusiness);
router.put('/admin/businesses/:businessId/activate', activateBusiness);
router.get('/admin/stats', getStats);
router.get('/admin/analytics/businesses', getAnalyticsBusinesses);
router.delete('/admin/businesses/:businessId', deleteBusiness);
router.put('/admin/businesses/:businessId', updateBusiness);
router.delete('/admin/businesses/:businessId/posts/:postId', deleteBusinessPost);
router.delete('/admin/businesses/:businessId/products/:productId', deleteBusinessProduct);
router.delete('/admin/businesses/:businessId/promotions/:promotionId', deleteBusinessPromotion);
router.get('/admin/businesses/:businessId/analytics', getBusinessAnalytics);

module.exports = router;
