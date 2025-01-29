const chatService = require('../services/chatService');
const responseHelper = require('../helpers/responseHelper');

// List all chats
exports.listChats = async (req, res) => {
    try {
        const chats = await chatService.listChats(req.user._id);
        return responseHelper.success(res, 'Chats fetched successfully', chats);
    } catch (error) {
        return responseHelper.error(res, 'Failed to list chats', error);
    }
};

// Open a single chat
exports.openChat = async (req, res) => {
    try {
        const chat = await chatService.openChat(req.params.chatId);
        return responseHelper.success(res, 'Chat opened successfully', chat);
    } catch (error) {
        return responseHelper.error(res, 'Failed to open chat', error);
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { message, messageType } = req.body;
        const chatMessage = await chatService.sendMessage(req.params.chatId, req.user._id, message, messageType);
        return responseHelper.success(res, 'Message sent successfully', chatMessage);
    } catch (error) {
        return responseHelper.error(res, 'Failed to send message', error);
    }
};

// Mark chat as read
exports.markChatAsRead = async (req, res) => {
    try {
        await chatService.markChatAsRead(req.params.messageId, req.user._id);
        return responseHelper.success(res, 'Chat marked as read successfully');
    } catch (error) {
        return responseHelper.error(res, 'Failed to mark chat as read', error);
    }
};

// Create a new chat
exports.createChat = async (req, res) => {
    const { title, description, participants } = req.body;
    const userId = req.user._id;
    try {
        const chat = await chatService.createChat(userId, title, description, participants);
        return responseHelper.success(res, 'Chat created successfully', chat);
    } catch (error) {
        return responseHelper.error(res, 'Failed to create chat', error);
    }
};