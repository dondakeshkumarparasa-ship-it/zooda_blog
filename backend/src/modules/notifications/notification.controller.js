const Notification = require('./notification.model');

const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user?._id || req.query.recipientId });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications
};
