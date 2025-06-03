const express = require('express');
const User = require('../models/User');
const Shop = require('../models/Shop');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    const shops = await Shop.getShopsByOwner(req.user._id);
    
    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        shops
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's shops
router.get('/shops', verifyToken, async (req, res) => {
  try {
    const shops = await Shop.getShopsByOwner(req.user._id);
    
    res.json({
      success: true,
      shops
    });
  } catch (error) {
    console.error('Shops fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get specific shop details
router.get('/shop/:shopName', verifyToken, async (req, res) => {
  try {
    const { shopName } = req.params;
    
    const shop = await Shop.findOne({ 
      name: shopName.toLowerCase(),
      owner: req.user._id,
      isActive: true
    });
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found or you do not have access to this shop'
      });
    }
    
    res.json({
      success: true,
      shop
    });
  } catch (error) {
    console.error('Shop fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify shop access (for subdomain authentication)
router.get('/verify-shop/:shopName', verifyToken, async (req, res) => {
  try {
    const { shopName } = req.params;
    
    const shop = await Shop.findOne({ 
      name: shopName.toLowerCase(),
      owner: req.user._id,
      isActive: true
    });
    
    if (!shop) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this shop'
      });
    }
    
    res.json({
      success: true,
      message: 'Shop access verified',
      shop: {
        name: shop.name,
        description: shop.description,
        owner: req.user.username
      },
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Shop verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
