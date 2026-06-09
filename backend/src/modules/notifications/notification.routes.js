const express = require('express');
const { createNotification, getNotifications } = require('./notification.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/notifications', createNotification);
router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;
