const express = require('express');
const { createOrder, getOrders } = require('./order.controller');
const { auth } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/orders', auth, createOrder);
router.get('/orders', auth, getOrders);

module.exports = router;
