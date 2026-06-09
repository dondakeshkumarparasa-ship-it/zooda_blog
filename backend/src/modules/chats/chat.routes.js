const express = require('express');
const {
  setupBot,
  trainText,
  reingestBot,
  getBotStatus,
  customerSend,
  businessSend,
  toggleAi,
  getCustomerChats,
  getBusinessChats,
  getChatsHistory,
  submitFeedback,
  getAdminFeedbacks,
  getAiSettings,
  updateAiSettings,
  getAiTokens
} = require('./chat.controller');
const { authMiddleware, auth } = require('../../middleware/auth.middleware');
const { pdfMemoryUpload } = require('../../middleware/upload.middleware');
const router = express.Router();

router.post('/bot/setup', pdfMemoryUpload.array('pdfs', 2), setupBot);
router.post('/bot/train-text', trainText);
router.post('/bot/:botId/reingest', pdfMemoryUpload.array('pdfs', 2), reingestBot);
router.get('/bot/:botId/status', getBotStatus);
router.post('/chats/customer/send', auth, customerSend);
router.post('/chats/business/send', authMiddleware, businessSend);
router.post('/chats/thread/:threadId/toggle-ai', authMiddleware, toggleAi);
router.get('/chats/customer', auth, getCustomerChats);
router.get('/chats/business', authMiddleware, getBusinessChats);
router.get('/chats/history', getChatsHistory);
router.post('/feedback', submitFeedback);
router.get('/admin/feedbacks', getAdminFeedbacks);
router.get('/admin/ai-settings', getAiSettings);
router.post('/admin/ai-settings', updateAiSettings);
router.get('/admin/ai-tokens', getAiTokens);

module.exports = router;
