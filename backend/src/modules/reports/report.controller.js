const Report = require('./report.model');

const generateReport = async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      generatedBy: req.user?._id || req.body.userId
    });
    await report.save();
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ business: req.query.businessId });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateReport,
  getReports
};
