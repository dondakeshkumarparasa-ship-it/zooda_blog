const express = require('express');
const {
  getAnalytics,
  saveImpression,
  saveClick,
  getCompanyAnalytics,
  getCompanyDashboard,
  getBusinessDashboard,
  getCompanyDetails
} = require('./analytics.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const router = express.Router();

router.get('/analytics', authMiddleware, getAnalytics);
router.post('/analytics/impression', saveImpression);
router.post('/analytics/click', saveClick);
router.get('/analytics/company/:companyId', getCompanyAnalytics);
router.get('/dashboard/company/:companyId', getCompanyDashboard);
router.get('/dashboard/:businessId', getBusinessDashboard);
router.get('/companies/:companyId', getCompanyDetails);

module.exports = router;
