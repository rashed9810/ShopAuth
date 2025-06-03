const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { generateTokens, verifyRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Signup route
router.post('/signup', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage('Password must contain at least one number and one special character'),
  body('shopNames')
    .isArray({ min: 3, max: 4 })
    .withMessage('You must provide between 3 and 4 shop names')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, shopNames } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Validate and check shop names for uniqueness
    const normalizedShopNames = shopNames.map(name => name.toLowerCase().trim());
    
    // Check for duplicate shop names in the request
    const uniqueShopNames = [...new Set(normalizedShopNames)];
    if (uniqueShopNames.length !== normalizedShopNames.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate shop names are not allowed'
      });
    }

    // Check if any shop names already exist globally
    for (const shopName of normalizedShopNames) {
      const existingShop = await Shop.isNameTaken(shopName);
      if (existingShop) {
        return res.status(400).json({
          success: false,
          message: `Shop name "${shopName}" is already taken`
        });
      }
    }

    // Create user
    const user = new User({
      username: username.toLowerCase(),
      password,
      shopNames: normalizedShopNames
    });

    await user.save();

    // Create shop records
    const shopPromises = normalizedShopNames.map(shopName => {
      const shop = new Shop({
        name: shopName,
        owner: user._id
      });
      return shop.save();
    });

    await Promise.all(shopPromises);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000 // 30 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// Signin route
router.post('/signin', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, rememberMe } = req.body;

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie expiration based on remember me
    const accessTokenExpiry = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
    const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000;

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenExpiry,
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenExpiry,
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      accessToken
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not provided'
      });
    }

    const user = await verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });

    res.json({
      success: true,
      accessToken,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (refreshToken) {
      // Remove refresh token from user
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    // Clear cookies
    res.clearCookie('accessToken', {
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });
    res.clearCookie('refreshToken', {
      domain: process.env.NODE_ENV === 'production' ? '.localhost' : undefined
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
