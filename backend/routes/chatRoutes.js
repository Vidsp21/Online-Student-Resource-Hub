const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChatHistory,
  getConversations,
  sendMessage
} = require('../controllers/chatController');

// All routes are protected
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getChatHistory);
router.post('/send', protect, sendMessage);

module.exports = router;
