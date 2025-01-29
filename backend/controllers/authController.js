const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse, successResponse } = require('../utils/responseHelper');
const authService = require('../services/authService');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser({ name, email, password });
        const token = authService.generateToken(user);
        return successResponse(res, 'User registered successfully', { token }, 200);
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, err.message, {}, 400);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser({ email, password });
        const token = authService.generateToken(user);
        return successResponse(res, 'User logged in successfully', { token }, 200);
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, err.message, {}, 400);
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = ticket.getPayload();
        const user = await authService.googleAuthUser({ name, email });
        const jwtToken = authService.generateToken(user);
        return successResponse(res, 'Google authentication successful', { token: jwtToken }, 200);
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, 'Server error', {}, 500);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const resetToken = await authService.forgotPassword(email);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            email,
            subject: 'Password Reset Request',
            message: `You requested a password reset. Please go to: ${resetUrl}`
        });
        return successResponse(res, 'Password reset email sent', {}, 200);
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, err.message, {}, 500);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;
        const user = await authService.resetPassword(resetToken, password);
        const token = authService.generateToken(user);
        return successResponse(res, 'Password reset successful', { token }, 200);
    } catch (err) {
        console.error(err.message);
        return errorResponse(res, err.message, {}, 400);
    }
};
