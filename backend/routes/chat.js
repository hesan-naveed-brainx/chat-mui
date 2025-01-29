const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// List all chats
router.get('/', chatController.listChats);

// Open a single chat
router.get('/:chatId', chatController.openChat);

// Send a message
router.post('/:chatId/messages', chatController.sendMessage);

// Mark chat as read
router.post('/messages/:messageId/read', chatController.markChatAsRead);

// Create a new chat
router.post('/', chatController.createChat);

module.exports = router;
