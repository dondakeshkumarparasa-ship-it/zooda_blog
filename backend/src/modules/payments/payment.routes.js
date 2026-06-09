const express = require('express');
const { processPayment, getPayments } = require('./payment.controller');
const { auth } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/payments', auth, processPayment);
router.get('/payments', auth, getPayments);

module.exports = router;
