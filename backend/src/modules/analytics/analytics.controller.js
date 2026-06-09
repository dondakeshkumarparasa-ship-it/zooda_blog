const Analytics = require('./analytics.model');
const CompanyAnalytics = require('./companyAnalytics.model');
const Business = require('../users/business.model');
const Post = require('../users/post.model');
const Product = require('../products/product.model');
const Promotion = require('../promotions/promotion.model');
const mongoose = require('mongoose');

const getAnalytics = async (req, res) => {
  try {
    const business = await Business.findOne({ user: req.user._id || req.user.id });
    if (!business) {
      return res.status(400).json({ message: 'No business found for this user' });
    }

    let analytics = await Analytics.findOne({ business: business._id }).sort({ date: -1 });

    if (!analytics) {
      analytics = await Analytics.create({
        user: req.user._id || req.user.id,
        business: business._id,
        period: 'monthly',
        date: new Date(),
        followers: { total: 12500, growth: 520 },
        engagement: { rate: 48.7, likes: 2450, comments: 356, shares: 128 },
        reach: { total: 45600, organic: 38900, paid: 6700 },
        sales: { revenue: 12560, orders: 156, conversionRate: 3.4 }
      });
    }

    const postsCount = await Post.countDocuments({ business: business._id });
    const productsCount = await Product.countDocuments({ business: business._id });

    const products = await Product.find({ business: business._id });
    const totalRevenue = products.reduce((sum, product) => sum + (product.sales?.revenue || 0), 0);

    res.json({
      success: true,
      analytics: {
        followers: analytics.followers.total,
        engagement: analytics.engagement.rate,
        posts: postsCount,
        leads: analytics.sales.orders,
        revenue: totalRevenue,
        products: productsCount
      },
      detailedAnalytics: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
};

const saveImpression = async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID required" });
    }

    if (userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const alreadyViewed = await CompanyAnalytics.findOne({
        companyId,
        userId,
        type: "impression",
        createdAt: { $gte: today },
      });

      if (alreadyViewed) {
        return res.json({ success: true, skipped: true });
      }
    }

    await CompanyAnalytics.create({
      companyId,
      userId: userId || null,
      type: "impression",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Impression error:", err);
    res.status(500).json({ success: false });
  }
};

const saveClick = async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID required" });
    }

    await CompanyAnalytics.create({
      companyId,
      userId: userId || null,
      type: "click",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Click error:", err);
    res.status(500).json({ success: false });
  }
};

const getCompanyAnalytics = async (req, res) => {
  try {
    const { companyId } = req.params;
    const daysRaw = parseInt(req.query.days || "7", 10);
    const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(daysRaw, 365)) : 7;

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const stats = await CompanyAnalytics.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    let impressions = 0;
    let clicks = 0;

    stats.forEach((item) => {
      if (item._id === "impression") impressions = item.count;
      if (item._id === "click") clicks = item.count;
    });

    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

    return res.json({
      success: true,
      range: { days, from: fromDate, to: toDate },
      impressions,
      clicks,
      ctr,
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching analytics" });
  }
};

const getCompanyDashboard = async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    const company = await Business.findById(companyId).select("businessName category createdAt");
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const [postMetrics, revenueResult, totalProductsCount, recentPosts, analyticsStats] = await Promise.all([
      Post.aggregate([
        { $match: { $or: [{ business: companyObjectId }, { company: companyObjectId }] } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalEngagement: {
              $sum: {
                $add: [
                  { $size: { $ifNull: ["$likesList", []] } },
                  { $size: { $ifNull: ["$commentsList", []] } },
                  { $ifNull: ["$shares", 0] },
                ],
              },
            },
          },
        },
        { $project: { _id: 0 } },
      ]),

      Product.aggregate([
        { $match: { $or: [{ business: companyObjectId }, { company: companyObjectId }] } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$sales.revenue" },
          },
        },
      ]),

      Product.countDocuments({ $or: [{ business: companyId }, { company: companyId }] }),

      Post.find({ $or: [{ business: companyObjectId }, { company: companyObjectId }] })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("content createdAt likesList commentsList"),

      CompanyAnalytics.aggregate([
        { $match: { companyId: companyObjectId } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    let impressions = 0;
    let clicks = 0;

    analyticsStats.forEach((item) => {
      if (item._id === "impression") impressions = item.count;
      if (item._id === "click") clicks = item.count;
    });

    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;

    const metrics = postMetrics[0] || { totalPosts: 0, totalEngagement: 0 };
    const revenue = revenueResult[0]?.totalRevenue || 0;

    const formattedActivity = recentPosts.map((post) => ({
      type: "post",
      description: `New post: "${post.content.substring(0, 30)}${post.content.length > 30 ? "..." : ""}"`,
      engagement: `${post.likesList?.length || 0} likes, ${post.commentsList?.length || 0} comments`,
      time: post.createdAt,
    }));

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalPosts: metrics.totalPosts,
          totalEngagement: metrics.totalEngagement,
          totalProducts: totalProductsCount,
          totalRevenue: Math.round(revenue * 100) / 100,
          impressions,
          clicks,
          ctr,
        },
        recentActivity: formattedActivity,
        company: {
          name: company.businessName,
          category: company.category,
          joinedDate: company.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching dashboard data" });
  }
};

const getBusinessDashboard = async (req, res) => {
  try {
    const { businessId } = req.params;

    const daysRaw = parseInt(req.query.days || "7", 10);
    const days = Number.isFinite(daysRaw) ? Math.max(1, Math.min(daysRaw, 365)) : 7;

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - days);

    const businessObjectId = new mongoose.Types.ObjectId(businessId);

    const business = await Business.findById(businessId).select(
      "businessName businessCategory createdAt followers"
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const postMatch = {
      business: businessObjectId,
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    const productMatch = {
      business: businessObjectId,
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    const promoMatch = {
      business: businessObjectId,
      createdAt: { $gte: fromDate, $lte: toDate },
      status: "active",
    };

    const analyticsMatch = {
      companyId: businessObjectId,
      createdAt: { $gte: fromDate, $lte: toDate },
    };

    const [
      postMetricsResult,
      productStatsResult,
      totalPromotions,
      recentPosts,
      recentProducts,
      platformStats,
      analyticsResult,
    ] = await Promise.all([
      Post.aggregate([
        { $match: postMatch },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalEngagement: {
              $sum: {
                $add: [
                  { $size: { $ifNull: ["$likesList", []] } },
                  { $size: { $ifNull: ["$commentsList", []] } },
                  {
                    $convert: {
                      input: { $ifNull: ["$shares", 0] },
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                ],
              },
            },
          },
        },
        { $project: { _id: 0, totalPosts: 1, totalEngagement: 1 } },
      ]),

      Product.aggregate([
        { $match: productMatch },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $ne: ["$sales.revenue", null] },
                  {
                    $convert: {
                      input: "$sales.revenue",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                  {
                    $multiply: [
                      {
                        $convert: {
                          input: "$sales",
                          to: "double",
                          onError: 0,
                          onNull: 0,
                        },
                      },
                      {
                        $convert: {
                          input: "$price",
                          to: "double",
                          onError: 0,
                          onNull: 0,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
        { $project: { _id: 0, totalProducts: 1, totalRevenue: 1 } },
      ]),

      Promotion.countDocuments(promoMatch),

      Post.find(postMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("content createdAt likesList commentsList shares"),

      Product.find(productMatch)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name createdAt sales price"),

      Post.aggregate([
        { $match: postMatch },
        { $unwind: { path: "$platforms", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ["$platforms", "unknown"] },
            count: { $sum: 1 },
            totalEngagement: {
              $sum: {
                $add: [
                  { $size: { $ifNull: ["$likesList", []] } },
                  { $size: { $ifNull: ["$commentsList", []] } },
                  {
                    $convert: {
                      input: { $ifNull: ["$shares", 0] },
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                ],
              },
            },
          },
        },
        { $sort: { count: -1 } },
      ]),

      CompanyAnalytics.aggregate([
        { $match: analyticsMatch },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const postMetrics = postMetricsResult?.[0] || { totalPosts: 0, totalEngagement: 0 };
    const productStats = productStatsResult?.[0] || { totalProducts: 0, totalRevenue: 0 };
    
    let impressions = 0;
    let clicks = 0;
    let visits = 0;

    analyticsResult.forEach((item) => {
      if (item._id === "impression") impressions = item.count;
      if (item._id === "click") clicks = item.count;
      if (item._id === "visit") visits = item.count;
    });

    const ctr =
      impressions > 0
        ? Number(((clicks / impressions) * 100).toFixed(2))
        : 0;

    const formattedPostActivity = recentPosts.map((post) => ({
      type: "post",
      description: `New post: "${(post.content || "").substring(0, 30)}${
        (post.content || "").length > 30 ? "..." : ""
      }"`,
      engagement: `${post.likesList?.length || 0} likes, ${post.commentsList?.length || 0} comments`,
      time: post.createdAt,
    }));

    const formattedProductActivity = recentProducts.map((product) => ({
      type: "product",
      description: `New product added: ${product.name}`,
      engagement: `${(typeof product.sales === "number" ? product.sales : product.sales?.count) || 0} sales`,
      time: product.createdAt,
    }));

    const recentActivity = [...formattedPostActivity, ...formattedProductActivity].sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    const followersCount = Array.isArray(business.followers) ? business.followers.length : (business.followers || 0);

    return res.json({
      success: true,
      range: {
        days,
        from: fromDate,
        to: toDate,
      },
      dashboard: {
        stats: {
          totalPosts: postMetrics.totalPosts,
          totalEngagement: postMetrics.totalEngagement,
          totalProducts: productStats.totalProducts,
          totalPromotions,
          followers: followersCount,
          totalRevenue: Math.round((Number(productStats.totalRevenue || 0)) * 100) / 100,
          impressions,
          clicks,
          visits,
          ctr,
        },
        recentActivity,
        platformPerformance: platformStats || [],
        business: {
          name: business.businessName,
          category: business.businessCategory,
          joinedDate: business.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard by business ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    });
  }
};

const getCompanyDetails = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Business.findById(companyId)
      .select("businessName businessCategory businessDescription businessWebsite businessAddress businessPhone logoUrl status verified followers totalPosts totalProducts engagementRate createdAt");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const companyObj = company.toObject();
    if (companyObj.logoUrl) {
      let logoUrl = companyObj.logoUrl;
      if (!logoUrl.startsWith("http")) {
        logoUrl = `${process.env.API_BASE_URL || 'https://zooda.vercel.app'}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
      }
      companyObj.logoUrl = logoUrl;
    }

    if (companyObj.businessName) {
      companyObj.username = companyObj.businessName.toLowerCase().replace(/[\s.]/g, "_");
      companyObj.name = companyObj.businessName;
    }

    res.json({
      success: true,
      company: companyObj
    });
  } catch (err) {
    console.error("Error fetching company details:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company details"
    });
  }
};

module.exports = {
  getAnalytics,
  saveImpression,
  saveClick,
  getCompanyAnalytics,
  getCompanyDashboard,
  getBusinessDashboard,
  getCompanyDetails
};
