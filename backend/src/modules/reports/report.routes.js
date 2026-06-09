const express = require('express');
const { generateReport, getReports } = require('./report.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/reports', authMiddleware, generateReport);
router.get('/reports', authMiddleware, getReports);

module.exports = router;
