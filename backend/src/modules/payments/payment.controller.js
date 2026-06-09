const Payment = require('./payment.model');

const processPayment = async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      user: req.user?._id || req.body.userId
    });
    await payment.save();
    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user?._id });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  processPayment,
  getPayments
};
