const express = require('express');
const {
  uploadProfileImage,
  getFollowing,
  updateUser,
  getFollowingPosts,
  getUnfollowedPosts,
  followBusiness,
  unfollowBusiness,
  getFollowStatus,
  getFollowers,
  getBusinessMe,
  updateBusinessProfile,
  createBusiness,
  getBusinessByUserId,
  updateBusiness,
  getBusinessFollowers,
  searchBusinesses,
  getBusinessAll,
  getBusinessById,
  getBusinessPostsOnly,
  createPost,
  deletePost
} = require('./user.controller');
const { authMiddleware } = require('../../middleware/auth.middleware');
const { cloudinaryUpload } = require('../../middleware/upload.middleware');

const router = express.Router();

router.post('/user/:userId/upload-image', uploadProfileImage);
router.get('/user/:userId/following', getFollowing);
router.put('/user/:userId', updateUser);
router.get('/posts/following/:userId', getFollowingPosts);
router.get('/posts/unfollowed/:userId', getUnfollowedPosts);
router.post('/follow/:businessId', followBusiness);
router.post('/unfollow/:businessId', unfollowBusiness);
router.get('/follow/:businessId/status/:userId', getFollowStatus);
router.get('/followers/:businessId', getFollowers);

// Business Profile & CRUD
router.get('/business/me', authMiddleware, getBusinessMe);
router.put('/profile', authMiddleware, updateBusinessProfile);
router.post('/business', authMiddleware, cloudinaryUpload.single('media'), createBusiness);
router.get('/business', getBusinessByUserId);
router.put('/business/:businessId', authMiddleware, cloudinaryUpload.single('media'), updateBusiness);
router.get('/business/:businessId/followers', getBusinessFollowers);
router.get('/business/search', searchBusinesses);
router.get('/business/all', getBusinessAll);
router.get('/business/:id', getBusinessById);
router.get('/businesses/:id', getBusinessById);
router.get('/businesses/:businessId/posts', getBusinessPostsOnly);
router.get('/post/:businessId', getBusinessPostsOnly);
router.post('/posts', authMiddleware, cloudinaryUpload.single('media'), createPost);
router.delete('/post/:postId', authMiddleware, deletePost);

module.exports = router;
