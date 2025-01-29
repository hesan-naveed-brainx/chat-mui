const mongoose = require('mongoose');
const ChatUser = require('./ConversationUser');

const chatMessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'activity', 'image', 'file', 'audio', 'video'], default: 'text' },
    attachments: [{ type: String, required: false }],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage', required: false },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: [] }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create ChatMessageUser entries for all users in the chat when a new message is created
chatMessageSchema.post('save', async function(message) {
    try {
        const Chat = mongoose.model('Chat');
        const ChatMessageUser = mongoose.model('ChatMessageUser');

        // Get the chat and its participants
        const chat = await Chat.findById(message.conversation);
        const chatUsers = await ChatUser.find({ chat: message.conversation });
        if (!chat || !chatUsers) return;

        // Create ChatMessageUser entries for all participants
        const chatMessageUsers = chatUsers.map(user => ({
            chatMessage: message._id,
            user: user._id,
            isRead: user._id.equals(message.sender), // Mark as read for sender
            chat: message.conversation
        }));

        await ChatMessageUser.insertMany(chatMessageUsers);
    } catch (error) {
        console.error('Error creating ChatMessageUser entries:', error);
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);