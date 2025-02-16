const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const { authMiddleware: authenticated } = require('./middlewares/authMiddleware');
dotenv.config();
connectDB().finally(() => {
    const app = express();

    // initializeJobs();

    app.use(cors());
    app.use(bodyParser.json());

    // Middleware to parse URL-encoded bodies (for non-file fields)
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve static files from the 'public' directory
    app.use('/public', express.static('public'));

    // Import Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/chat', authenticated, chatRoutes);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});