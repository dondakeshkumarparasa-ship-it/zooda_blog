const mongoose = require('mongoose');
const Client = require('../clients/client.model');
const Business = require('./business.model');
const Post = require('./post.model');
const Product = require('../products/product.model');
const Promotion = require('../promotions/promotion.model');
const User = require('../auth/auth.model');
const { cloudinary } = require('../../config/cloudinary');
const { updateBusinessEngagementRate } = require('../../helpers/engagement');

// Helper: Get user business
const getUserBusiness = async (userId) => {
  try {
    return await Business.findOne({ user: userId });
  } catch (error) {
    console.error("Database Error in getUserBusiness:", error);
    return null; 
  }
};

const uploadProfileImage = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL is required" });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: imageUrl
    });
  } catch (err) {
    console.error("Error uploading profile image:", err);
    res.status(500).json({ success: false, message: "Server error while uploading profile image" });
  }
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Client.findById(userId)
      .select("following")
      .populate({
        path: "following",
        select: "businessName businessCategory businessDescription businessWebsite logoUrl verified followers totalPosts totalProducts engagementRate",
        model: "Business"
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const followingBusinesses = (user.following || []).map(business => {
      const businessObj = business.toObject();
      if (businessObj.logoUrl && !businessObj.logoUrl.startsWith("http")) {
        businessObj.logoUrl = `${process.env.API_BASE_URL || 'https://api.zooda.in'}${businessObj.logoUrl.startsWith("/") ? "" : "/"}${businessObj.logoUrl}`;
      }
      if (businessObj.businessName) {
        businessObj.username = businessObj.businessName.toLowerCase().replace(/[\s.]/g, "_");
        businessObj.name = businessObj.businessName;
      }
      return businessObj;
    });

    res.json({
      success: true,
      following: followingBusinesses,
      count: followingBusinesses.length
    });
  } catch (err) {
    console.error("Error fetching user's following businesses:", err);
    res.status(500).json({ success: false, message: "Server error while fetching followed businesses" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone, bio, website, profileImage } = req.body;
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await Client.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (bio !== undefined) updateFields.bio = bio;
    if (website !== undefined) updateFields.website = website;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    const updatedUser = await Client.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

const getFollowingPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const businesses = await Business.find({ 
      followersList: userId,
      status: 'active'
    }).select("_id businessName businessCategory businessDescription businessWebsite businessAddress businessPhone logoUrl verified followers totalPosts");

    if (!businesses || businesses.length === 0) {
      return res.json({ success: true, posts: [], message: "User is not following any businesses" });
    }

    const businessIds = businesses.map(b => b._id);
    const posts = await Post.find({ business: { $in: businessIds } })
      .populate({
        path: 'business',
        select: 'businessName businessCategory businessDescription businessWebsite logoUrl verified followers totalPosts createdAt',
        model: 'Business'
      })
      .sort({ createdAt: -1 });

    const processedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (!postObj.business || !postObj.business.businessName) {
        const businessId = postObj.business?._id || postObj.business;
        const foundBusiness = businesses.find(b => b._id.toString() === businessId?.toString());
        if (foundBusiness) {
          postObj.business = foundBusiness.toObject();
        } else {
          postObj.business = {
            _id: businessId,
            businessName: "Unknown Business",
            username: "unknown_business",
            logoUrl: null
          };
        }
      }

      if (postObj.business && postObj.business.logoUrl) {
        let logoUrl = postObj.business.logoUrl;
        if (!logoUrl.startsWith("http")) {
          logoUrl = `${process.env.API_BASE_URL || 'https://api.zooda.in'}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
        }
        postObj.business.logoUrl = logoUrl;
      }

      if (postObj.business && postObj.business.businessName) {
        postObj.business.username = postObj.business.businessName.toLowerCase().replace(/[\s.]/g, "_");
        postObj.business.name = postObj.business.businessName;
      }
      return postObj;
    });

    res.json({
      success: true,
      count: processedPosts.length,
      posts: processedPosts,
    });
  } catch (err) {
    console.error("Error fetching following posts:", err);
    res.status(500).json({ success: false, message: "Server error while fetching following posts" });
  }
};

const getUnfollowedPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const followedBusinesses = await Business.find({ followersList: userId }).select("_id");
    const followedIds = followedBusinesses.map(b => b._id);

    const unfollowedBusinesses = await Business.find({
      _id: { $nin: followedIds },
      status: 'active'
    }).select("_id businessName businessCategory businessDescription businessWebsite logoUrl verified followers totalPosts");

    const posts = await Post.find({ business: { $nin: followedIds } })
      .populate({
        path: 'business',
        select: 'businessName businessCategory businessDescription businessWebsite logoUrl verified followers totalPosts createdAt',
        model: 'Business'
      })
      .sort({ createdAt: -1 });

    const processedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (!postObj.business || !postObj.business.businessName) {
        const businessId = postObj.business?._id || postObj.business;
        const foundBusiness = unfollowedBusinesses.find(b => b._id.toString() === businessId?.toString());
        if (foundBusiness) {
          postObj.business = foundBusiness.toObject();
        } else {
          postObj.business = {
            _id: businessId,
            businessName: "Unknown Business",
            username: "unknown_business",
            logoUrl: null
          };
        }
      }

      if (postObj.business && postObj.business.logoUrl) {
        let logoUrl = postObj.business.logoUrl;
        if (!logoUrl.startsWith("http")) {
          logoUrl = `${process.env.API_BASE_URL || 'https://api.zooda.in'}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
        }
        postObj.business.logoUrl = logoUrl;
      }

      if (postObj.business && postObj.business.businessName) {
        postObj.business.username = postObj.business.businessName.toLowerCase().replace(/[\s.]/g, "_");
        postObj.business.name = postObj.business.businessName;
      }
      return postObj;
    });

    res.json({ success: true, count: processedPosts.length, posts: processedPosts });
  } catch (err) {
    console.error("Error fetching unfollowed posts:", err);
    res.status(500).json({ success: false, message: "Server error while fetching unfollowed posts" });
  }
};

const followBusiness = async (req, res) => {
  const { businessId } = req.params;
  const { userId } = req.body;
  try {
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    if (!business.followersList) business.followersList = [];
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isFollowing = business.followersList.some(followerId => followerId.equals(userObjectId));

    if (isFollowing) {
      business.followersList = business.followersList.filter(followerId => !followerId.equals(userObjectId));
    } else {
      business.followersList.push(userObjectId);
    }

    business.followers = business.followersList.length;
    await business.save();

    await updateBusinessEngagementRate(business._id);

    await Client.findByIdAndUpdate(userId, {
      [isFollowing ? '$pull' : '$addToSet']: { following: business._id }
    });

    res.json({ success: true, followers: business.followers, isFollowing: !isFollowing });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const unfollowBusiness = async (req, res) => {
  const { businessId } = req.params;
  const { userId } = req.body;
  try {
    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    if (business.followers && business.followers > 0) business.followers -= 1;
    business.followersList = business.followersList.filter(id => id.toString() !== userId);
    await business.save();

    await updateBusinessEngagementRate(business._id);

    await Client.findByIdAndUpdate(userId, {
      $pull: { following: business._id }
    });

    res.json({ success: true, followers: business.followers });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFollowStatus = async (req, res) => {
  const { businessId, userId } = req.params;
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    if (!business.followersList) business.followersList = [];
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isFollowing = business.followersList.some(followerId => followerId.equals(userObjectId));

    res.json({ success: true, isFollowing });
  } catch (err) {
    console.error("Error checking follow status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId)
      .populate("followersList", "name email");
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.json({ success: true, followers: business.followersList });
  } catch (err) {
    console.error("Error fetching followers:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- POSTS OPERATIONS ---
const createPost = async (req, res) => {
  try {
    const { content, platforms, scheduledFor, tags, category, caption } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const business = await getUserBusiness(req.user._id || req.user.id);
    if (!business) {
      return res.status(400).json({ message: "No business found for this user" });
    }

    let platformsArray = ["facebook"];
    if (platforms) {
      if (typeof platforms === "string") {
        platformsArray = platforms.split(",");
      } else if (Array.isArray(platforms)) {
        platformsArray = platforms;
      }
    }

    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    let mediaUrl = null;
    let mediaType = "none";
    let mediaMetadata = null;

    if (req.file) {
      mediaUrl = req.file.path;
      mediaType = req.file.mimetype?.startsWith("video/") ? "video" : "image";
      mediaMetadata = {
        public_id: req.file.filename,
        format: req.file.format,
        size: req.file.size || null,
        resource_type: req.file.mimetype?.startsWith("video/") ? "video" : "image",
      };
    }

    const post = await Post.create({
      user: req.user._id || req.user.id,
      business: business._id,
      content,
      mediaUrl,
      mediaType,
      mediaMetadata,
      platforms: platformsArray,
      scheduledFor: scheduledFor || null,
      tags: tagsArray,
      category: category || "General",
      caption: caption || "",
      status: scheduledFor ? "scheduled" : "published",
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "firstName lastName email")
      .populate("business", "businessName businessCategory");

    // Sync business total post count
    const postsCount = await Post.countDocuments({ business: business._id });
    await Business.findByIdAndUpdate(business._id, { totalPosts: postsCount });
    await updateBusinessEngagementRate(business._id);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error while creating post" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const days = req.query.days ? parseInt(req.query.days, 10) : null;

    const query = { $or: [{ business: businessId }, { businessId: businessId }] };
    if (status) query.status = status;

    if (days && !Number.isNaN(days) && days > 0) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      query.createdAt = { $gte: fromDate };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "likesList.userId",
        model: "Client",
        select: "name email avatar",
      })
      .populate({
        path: "commentsList.userId",
        model: "Client",
        select: "name email avatar",
      })
      .lean();

    const total = await Post.countDocuments(query);

    const formattedPosts = posts.map((p) => ({
      ...p,
      likesList: (p.likesList || []).map((l) => l?.userId).filter(Boolean),
      commentsList: (p.commentsList || []).map((c) => ({
        ...c,
        user: c.userId || null,
        userId: undefined,
      })),
    }));

    return res.status(200).json({
      success: true,
      posts: formattedPosts,
      pagination: { page, limit, pages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    console.error("Error fetching posts by business:", error);
    return res.status(500).json({ success: false, message: "Server error while fetching posts" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.mediaUrl = req.file.path;
      updateData.mediaType = req.file.mimetype?.startsWith("video/") ? "video" : "image";
      updateData.mediaMetadata = {
        public_id: req.file.filename,
        format: req.file.format,
        size: req.file.size || null,
        resource_type: req.file.mimetype?.startsWith("video/") ? "video" : "image",
      };
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Post updated successfully',
      post: updatedPost 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.business) {
      const postsCount = await Post.countDocuments({ business: post.business });
      await Business.findByIdAndUpdate(post.business, { totalPosts: postsCount });
      await updateBusinessEngagementRate(post.business);
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const getBusinessPosts = async (req, res) => {
  try {
    const posts = await Post.find({ $or: [{ business: req.params.businessId }, { businessId: req.params.businessId }] })
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID or user ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!Array.isArray(post.likesList)) {
      post.likesList = [];
    }

    const existingLikeIndex = post.likesList.findIndex(
      like => like.userId && like.userId.toString() === userObjectId.toString()
    );

    let newLikeStatus;
    let action;
    
    if (existingLikeIndex !== -1) {
      post.likesList.splice(existingLikeIndex, 1);
      newLikeStatus = false;
      action = "unliked";
    } else {
      post.likesList.push({ userId: userObjectId });
      newLikeStatus = true;
      action = "liked";
    }

    post.likesCount = post.likesList.length;
    post.updatedAt = new Date();
    await post.save();

    if (post.business) {
      await updateBusinessEngagementRate(post.business);
    }

    return res.json({
      success: true,
      message: `Post ${action}`,
      likesCount: post.likesCount,
      isLiked: newLikeStatus
    });
  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({ success: false, message: "Server error while processing like", error: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const { postId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID or user ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (!Array.isArray(post.commentsList)) {
      post.commentsList = [];
    }

    const newComment = {
      userId: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      date: new Date()
    };

    post.commentsList.push(newComment);
    post.commentsCount = post.commentsList.length;
    post.updatedAt = new Date();
    await post.save();

    const ClientModel = mongoose.model('Client');
    const populatedComment = {
      ...newComment,
      userId: await ClientModel.findById(userId).select('firstName lastName email avatar username name')
    };

    if (post.business) {
      await updateBusinessEngagementRate(post.business);
    }

    return res.json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
      commentsCount: post.commentsCount
    });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ success: false, message: "Server error while adding comment", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.commentsList = post.commentsList.filter(c => c._id?.toString() !== commentId);
    post.commentsCount = post.commentsList.length;
    await post.save();

    if (post.business) {
      await updateBusinessEngagementRate(post.business);
    }

    res.json({ success: true, message: "Comment deleted successfully", commentsCount: post.commentsCount });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
};

const getLikeStatus = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID or user ID format" });
    }

    const post = await Post.findById(postId).select('likesList likesCount');
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = post.likesList.some(like => like.userId && like.userId.toString() === userObjectId.toString());

    res.json({ 
      success: true,
      isLiked,
      likesCount: post.likesCount || post.likesList.length
    });
  } catch (err) {
    console.error("Like status error:", err);
    res.status(500).json({ success: false, message: "Server error checking like status", error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId)
      .populate('commentsList.userId', 'name email avatar username')
      .select('commentsList commentsCount');

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ 
      success: true, 
      comments: post.commentsList || [],
      commentsCount: post.commentsCount || post.commentsList.length
    });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false, message: "Server error fetching comments", error: err.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId)
      .populate({
        path: "likesList.userId",
        select: "firstName lastName email avatar username name",
        model: 'Client'
      });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const likedUsers = post.likesList.filter(like => like.userId).map(like => like.userId);

    res.status(200).json({
      success: true,
      totalLikes: likedUsers.length,
      likesCount: post.likesCount || likedUsers.length,
      users: likedUsers
    });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ success: false, message: "Server error while fetching liked users", error: error.message });
  }
};

const debugPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).lean();
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }
    
    res.json({
      success: true,
      postStructure: {
        _id: post._id,
        business: post.business,
        user: post.user,
        likesListExists: !!post.likesList,
        likesListLength: post.likesList ? post.likesList.length : 0,
        likesCount: post.likesCount,
        commentsListExists: !!post.commentsList,
        commentsListLength: post.commentsList ? post.commentsList.length : 0,
        commentsCount: post.commentsCount,
        mediaUrl: post.mediaUrl,
        content: post.content ? post.content.substring(0, 50) + "..." : null,
        allFields: Object.keys(post)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId)
      .populate('business', 'businessName logoUrl')
      .populate('comments.userId', 'firstName lastName avatar')
      .populate('commentsList.userId', 'firstName lastName avatar')
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const likesArray = post.likesList || post.likes || [];
    const commentsArray = post.comments || post.commentsList || [];
    
    let isLiked = false;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      isLiked = likesArray.some(like => like && like.userId && like.userId.toString() === userObjectId.toString());
    }

    res.json({
      success: true,
      post: {
        ...post,
        likesCount: post.likesCount || likesArray.length,
        commentsCount: post.commentsCount || commentsArray.length,
        isLiked: isLiked,
        likes: likesArray,
        comments: commentsArray
      }
    });
  } catch (error) {
    console.error("Get post details error:", error);
    res.status(500).json({ success: false, message: "Server error fetching post details", error: error.message });
  }
};

// --- NEW BUSINESS OPERATIONS ---

const getBusinessMe = async (req, res) => {
  try {
    let business = await Business.findOne({ user: req.user._id || req.user.id })
      .populate('user', 'firstName lastName email avatar')
      .lean();

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'No business found for this user',
      });
    }

    if (!business.apiKey) {
      const crypto = require('crypto');
      const randomStr = crypto.randomBytes(8).toString('hex');
      const newKey = `zooda_pk_live_${randomStr}`;
      await Business.findByIdAndUpdate(business._id, { apiKey: newKey });
      business.apiKey = newKey;
    }

    res.json({ success: true, business });
  } catch (error) {
    console.error('Fetch business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

const updateBusinessProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.avatar = req.body.avatar || user.avatar;
      user.socialAccounts = req.body.socialAccounts || user.socialAccounts;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
          socialAccounts: updatedUser.socialAccounts,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

const createBusiness = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const {
      businessName,
      businessCategory,
      businessDescription,
      businessWebsite,
      businessAddress,
      businessPhone,
    } = req.body;

    if (!businessName || !businessCategory || !businessDescription || !businessAddress || !businessPhone) {
      return res.status(400).json({ message: "All business fields are required" });
    }

    const cleanPhone = businessPhone.replace(/[\s\-\(\)]/g, "");

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: "Please enter a valid phone number" });
    }

    if (businessWebsite && businessWebsite.trim() !== "") {
      try {
        new URL(businessWebsite);
      } catch {
        return res.status(400).json({ message: "Please enter a valid website URL" });
      }
    }

    const existingBusiness = await Business.findOne({ user: userId });

    if (existingBusiness) {
      return res.status(400).json({
        message: "You already have a business registered",
      });
    }

    const duplicateBusiness = await Business.findOne({
      businessName: new RegExp(`^${businessName.trim()}$`, "i"),
    });

    if (duplicateBusiness) {
      return res.status(400).json({
        message: "A business with this name already exists",
      });
    }

    const crypto = require('crypto');
    const randomStr = crypto.randomBytes(8).toString('hex');
    const newKey = `zooda_pk_live_${randomStr}`;

    const businessData = {
      user: userId,
      businessName: businessName.trim(),
      businessCategory,
      businessDescription: businessDescription.trim(),
      businessAddress: businessAddress.trim(),
      businessPhone: cleanPhone,
      businessWebsite:
        businessWebsite && businessWebsite.trim() !== ""
          ? businessWebsite.trim()
          : null,
      status: "pending",
      verified: false,
      apiKey: newKey
    };

    if (req.file?.path) {
      businessData.logoUrl = req.file.path;
    }

    const business = await Business.create(businessData);

    await User.findByIdAndUpdate(userId, {
      role: "business_owner",
      hasBusiness: true,
    });

    const populatedBusiness = await Business.findById(business._id)
      .populate("user", "firstName lastName email avatar")
      .lean();

    res.status(201).json({
      success: true,
      message: "Business registered successfully!",
      business: populatedBusiness,
    });

  } catch (error) {
    console.error("Create business error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate business data detected",
      });
    }

    res.status(500).json({
      message: "Internal server error while creating business",
    });
  }
};

const getBusinessByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing userId in request query.' 
      });
    }

    const business = await Business.findOne({ user: userId })
      .populate('user', 'firstName lastName email role');

    if (!business) {
      return res.status(404).json({ 
        success: false, 
        message: 'Business not found for this user.' 
      });
    }

    res.json({
      success: true,
      business
    });

  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching business.' 
    });
  }
};

const extractPublicIdFromUrl = (url) => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : null;
};

const updateBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    
    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const business = await Business.findOne({
      _id: businessId,
      user: req.user._id || req.user.id
    });

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found or unauthorized" });
    }

    const {
      businessName,
      businessCategory,
      businessDescription,
      businessWebsite,
      businessAddress,
      businessPhone,
      removeLogo
    } = req.body;

    const updateData = {};

    if (businessName !== undefined) {
      const trimmed = businessName.trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, message: "Business name is required" });
      }
      if (trimmed.length < 2 || trimmed.length > 100) {
        return res.status(400).json({ success: false, message: "Business name must be between 2 and 100 characters" });
      }

      const duplicate = await Business.findOne({
        businessName: { $regex: new RegExp(`^${trimmed}$`, "i") },
        _id: { $ne: businessId }
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: "A business with this name already exists" });
      }
      updateData.businessName = trimmed;
    }

    if (businessCategory !== undefined) {
      if (!businessCategory.trim()) {
        return res.status(400).json({ success: false, message: "Business category is required" });
      }
      updateData.businessCategory = businessCategory;
    }

    if (businessDescription !== undefined) {
      const trimmed = businessDescription.trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, message: "Business description is required" });
      }
      if (trimmed.length < 10 || trimmed.length > 500) {
        return res.status(400).json({ success: false, message: "Business description must be between 10 and 500 characters" });
      }
      updateData.businessDescription = trimmed;
    }

    if (businessAddress !== undefined) {
      const trimmed = businessAddress.trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, message: "Business address is required" });
      }
      if (trimmed.length > 200) {
        return res.status(400).json({ success: false, message: "Business address must be less than 200 characters" });
      }
      updateData.businessAddress = trimmed;
    }

    if (businessPhone !== undefined) {
      const trimmed = businessPhone.replace(/[\s\-\(\)]/g, "");
      if (!trimmed) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
      }
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(trimmed)) {
        return res.status(400).json({ success: false, message: "Please enter a valid phone number" });
      }
      updateData.businessPhone = trimmed;
    }

    if (businessWebsite !== undefined) {
      const trimmed = businessWebsite.trim();
      if (trimmed === "") {
        updateData.businessWebsite = null;
      } else {
        try {
          new URL(trimmed);
          updateData.businessWebsite = trimmed;
        } catch (error) {
          return res.status(400).json({ success: false, message: "Please enter a valid website URL" });
        }
      }
    }

    if (req.file && req.file.path) {
      if (business.logoUrl) {
        const publicId = extractPublicIdFromUrl(business.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updateData.logoUrl = req.file.path;
    } else if (removeLogo === "true" || removeLogo === true) {
      if (business.logoUrl) {
        const publicId = extractPublicIdFromUrl(business.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updateData.logoUrl = null;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName email avatar");

    const user = await User.findById(req.user._id || req.user.id);
    if (user.role !== "business_owner" || !user.hasBusiness) {
      await User.findByIdAndUpdate(req.user._id || req.user.id, {
        role: "business_owner",
        hasBusiness: true,
      });
    }

    res.json({
      success: true,
      message: "Business profile updated successfully!",
      business: updatedBusiness,
    });

  } catch (error) {
    console.error("Update business error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Business with this name already exists" });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while updating business"
    });
  }
};

const getBusinessFollowers = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId).populate("followersList", "name email");
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });
    res.json({ success: true, followers: business.followersList });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const searchBusinesses = async (req, res) => {
  try {
    const { filter, category } = req.query;
    const query = { verified: true, status: "active" };

    if (category && category !== "All") {
      query.businessCategory = category;
    }

    const businesses = await Business.find(query).sort({ createdAt: -1 });

    const populatedBusinesses = await Promise.all(
      businesses.map(async (business) => {
        const [products, posts] = await Promise.all([
          Product.find({ business: business._id }).sort({ createdAt: -1 }),
          Post.find({ business: business._id }).sort({ createdAt: -1 }),
        ]);

        return {
          ...business.toObject(),
          products,
          posts,
        };
      })
    );

    res.status(200).json({
      success: true,
      businesses: populatedBusinesses,
    });
  } catch (err) {
    console.error("Error fetching businesses with products/posts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses with products and posts",
    });
  }
};

const getBusinessAll = async (req, res) => {
  try {
    const { filter, category } = req.query;
    const query = { verified: true, status: "active" };

    if (category && category !== "All") {
      query.businessCategory = category;
    }

    const businesses = await Business.find(query).sort({ createdAt: -1 });
    res.status(200).json(businesses);
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
    });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .select('-__v');

    if (!business) {
      return res.status(404).json({ 
        success: false, 
        message: 'Business not found' 
      });
    }

    const products = await Product.find({ 
      business: req.params.id, 
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .select('name description price stock images category');

    const reviews = await Post.find({ business: req.params.id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        business,
        products,
        reviews
      }
    });
  } catch (error) {
    console.error('Get business by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching business' 
    });
  }
};

const getBusinessPostsOnly = async (req, res) => {
  try {
    const posts = await Post.find({ business: req.params.businessId })
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadProfileImage,
  getFollowing,
  updateUser,
  getFollowingPosts,
  getUnfollowedPosts,
  followBusiness,
  unfollowBusiness,
  getFollowStatus,
  getFollowers,
  createPost,
  getPosts,
  getPostByBusiness,
  updatePost,
  deletePost,
  getBusinessPosts,
  likePost,
  commentPost,
  deleteComment,
  getLikeStatus,
  getComments,
  getLikes,
  debugPost,
  getPostDetails,
  getBusinessMe,
  updateBusinessProfile,
  createBusiness,
  getBusinessByUserId,
  updateBusiness,
  getBusinessFollowers,
  searchBusinesses,
  getBusinessAll,
  getBusinessById,
  getBusinessPostsOnly
};
