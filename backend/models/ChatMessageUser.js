const mongoose = require('mongoose');

const chatMessageUserSchema = new mongoose.Schema({
    chatMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

chatMessageUserSchema.addListener('save', async function(next) {
    // TODO: Send a Realtime Notification to the user
    next();
});

module.exports = mongoose.model('ChatMessageUser', chatMessageUserSchema);