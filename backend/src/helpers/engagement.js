const mongoose = require('mongoose');
const Post = require('../modules/users/post.model');
const Business = require('../modules/users/business.model');

async function updateBusinessEngagementRate(businessId) {
    const businessObjectId = new mongoose.Types.ObjectId(businessId);

    // 1. Run aggregation to collect post engagement
    const result = await Post.aggregate([
        { $match: { business: businessObjectId } },
        {
            $group: {
                _id: null,
                totalPosts: { $sum: 1 },
                totalLikes: { $sum: { $size: { $ifNull: ["$likesList", []] } } },
                totalComments: { $sum: { $size: { $ifNull: ["$commentsList", []] } } },
                totalShares: { $sum: { $ifNull: ["$shares", 0] } },
                totalReviews: { $sum: { $size: { $ifNull: ["$commentsList", []] } } }
            }
        }
    ]);

    const metrics = result[0] || {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalReviews: 0
    };

    // 2. Fetch product count from business
    const business = await Business.findById(businessId).select("totalProducts");
    const productCount = business?.totalProducts || 0;

    // 3. Weighted Score
    const weightedScore =
        (metrics.totalLikes * 0.1) +
        (metrics.totalComments * 0.1) +
        (metrics.totalShares * 0.2) +
        (metrics.totalReviews * 0.2) +
        (productCount * 0.4);

    // 4. Avoid division error. Denominator = max(1, totalPosts)
    const denominator = Math.max(metrics.totalPosts, 1);

    const engagementRate = parseFloat(((weightedScore / denominator) * 100).toFixed(2));

    // 5. Save results
    await Business.findByIdAndUpdate(businessId, {
        engagementRate,
        totalPosts: metrics.totalPosts,
    });
}

module.exports = {
    updateBusinessEngagementRate
};
