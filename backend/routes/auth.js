const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/google
// @desc    Login or register with Google
// @access  Public
router.post('/google', authController.googleAuth);

// @route   POST /api/auth/forgot-password
// @desc    Forgot user password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', authController.resetPassword);

module.exports = router;
