const Order = require('./order.model');

const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user?._id || req.body.userId
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders
};
