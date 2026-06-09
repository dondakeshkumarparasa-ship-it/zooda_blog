const Promotion = require('./promotion.model');
const Business = require('../users/business.model');
const mongoose = require('mongoose');

const createPromotion = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user._id || req.user.id });
    if (!business) {
      return res.status(400).json({
        success: false,
        message: "No business found for this user",
      });
    }

    const imageUrl = req.file && req.file.path ? req.file.path : null;

    const promotion = new Promotion({
      ...req.body,
      user: req.user._id || req.user.id,
      business: business._id,
      image: imageUrl,
    });

    await promotion.save();

    res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      promotion,
    });
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create promotion",
    });
  }
};

const getPromotionsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const promotions = await Promotion.find({
      $or: [
        { business: businessId },
        { businessId: businessId }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      promotions,
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: 'Server error while fetching promotions' });
  }
};

const getActivePromotions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isActive, companyId, businessId, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (companyId) query.companyId = companyId;
    if (businessId) query.businessId = businessId;
    if (search) query.name = { $regex: search, $options: 'i' };

    const promotions = await Promotion.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Promotion.countDocuments(query);

    res.json({
      success: true,
      data: promotions,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }
    res.json({ success: true, message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ success: false, message: "Failed to delete promotion" });
  }
};

const getSinglePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    res.json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompanyPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ business: req.params.businessId });
    res.json({ success: true, promotions });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const promotionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(promotionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid promotion ID format'
      });
    }
    
    const existingPromotion = await Promotion.findById(promotionId);
    if (!existingPromotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }
    
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (req.file) {
      updateData.image = req.file.path || `/uploads/${req.file.filename}`;
    }
    
    if (updateData.platforms) {
      updateData.platforms = Array.isArray(updateData.platforms) 
        ? updateData.platforms 
        : [updateData.platforms];
    }
    
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      promotionId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Promotion updated successfully',
      data: updatedPromotion
    });
  } catch (error) {
    console.error('Promotion update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const trackPromotion = async (req, res) => {
  try {
    const { type } = req.body;
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    if (!promotion.performance) {
      promotion.performance = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
    }

    if (type === "impression") promotion.performance.impressions += 1;
    if (type === "click") promotion.performance.clicks += 1;

    await promotion.save();

    res.json({ success: true, promotion });
  } catch (error) {
    console.error("Track promotion error:", error);
    res.status(500).json({ success: false, message: "Failed to track promotion" });
  }
};

module.exports = {
  createPromotion,
  getPromotionsByBusiness,
  getActivePromotions,
  deletePromotion,
  getSinglePromotion,
  getCompanyPromotions,
  updatePromotion,
  trackPromotion
};
