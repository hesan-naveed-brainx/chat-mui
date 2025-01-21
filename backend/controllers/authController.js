const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../utils/responseHelper');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return errorResponse(res, 'User already exists', {}, 400);
        }
        // Create new user
        user = new User({ name, email, password });
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        // Create and return JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            return successResponse(res, 'User registered successfully', { token }, 200);
        });
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 'Invalid credentials', {}, 400);
        }
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', {}, 400);
        }
        // Create and return JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            return successResponse(res, 'User logged in successfully', { token }, 200);
        });
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                name,
                email,
                password: email + process.env.JWT_SECRET // Create a unique password
            });
            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
        }

        // Create and return JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            return successResponse(res, 'Google authentication successful', { token }, 200);
        });
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 'User not found', {}, 404);
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Set token and expiry
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: `You requested a password reset. Please go to: ${resetUrl}`
            });

            return successResponse(res, 'Password reset email sent', {}, 200);
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return errorResponse(res, 'Email could not be sent', {}, 500);
        }
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return errorResponse(res, 'Invalid or expired reset token', {}, 400);
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Create and return JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            return successResponse(res, 'Password reset successful', { token }, 200);
        });
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};
