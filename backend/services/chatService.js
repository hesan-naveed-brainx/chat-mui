const Chat = require('../models/Chat');
const ChatMessage = require('../models/ChatMessage');
const ChatMessageUser = require('../models/ChatMessageUser');
const ChatUser = require('../models/ChatUser');

exports.listChats = async (userId) => {
    // Find all chat IDs where the user is a participant
    const chatUserEntries = await ChatUser.find({ user: userId }).select('chat');
    const chatIds = chatUserEntries.map(entry => entry.chat);

    // Retrieve all chats with the found chat IDs
    const chats = await Chat.find({ _id: { $in: chatIds } }).sort({ updatedAt: -1 });

    return chats;
};

exports.openChat = async (chatId) => {
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }
    const messages = await ChatMessage.find({ conversation: chatId }).sort({ createdAt: -1 });
    // Mark all normal messages as read for this user
    await ChatMessageUser.updateMany(
        { chatMessage: { $in: messages.map(message => message._id) }, user: userId, parentMessage: null },
        { isRead: true }
    );
    chat.messages = messages;
    return chat;
};

exports.sendMessage = async (chatId, userId, message, messageType) => {
    const chatMessage = new ChatMessage({
        message,
        messageType,
        sender: userId,
        conversation: chatId
    });
    await chatMessage.save();
    return chatMessage;
};

exports.createChat = async (userId, title, description, participants) => {
    // Create and save the chat
    const chat = new Chat({ title, description, participants, createdBy: userId });
    await chat.save();

    // Create chat user entries for all participants including creator
    const allParticipants = [...participants, userId];
    await Promise.all(allParticipants.map(participantId => {
        const chatUser = new ChatUser({
            chat: chat._id,
            user: participantId
        });
        return chatUser.save();
    }));

    // Create activity message for chat creation
    const chatMessage = new ChatMessage({
        message: `${userId} created a chat`,
        messageType: 'activity',
        sender: userId,
        conversation: chat._id,
        parentMessage: null
    });
    await chatMessage.save();

    // Create message user entries for all participants
    await Promise.all(allParticipants.map(participantId => {
        const messageUser = new ChatMessageUser({
            chatMessage: chatMessage._id,
            user: participantId,
            isRead: participantId === userId // Creator has read the message
        });
        return messageUser.save();
    }));

    return chat;
};
