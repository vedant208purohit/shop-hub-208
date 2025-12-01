const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { name, email, role, phone, address } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue - only count non-cancelled orders with completed payment
    // Revenue should only include orders that are actually completed/delivered
    let totalRevenue = 0;
    try {
      // Aggregate only orders that are:
      // 1. NOT cancelled (orderStatus !== 'cancelled')
      // 2. Payment completed (paymentStatus === 'completed')
      // This ensures we only count actual successful transactions
      const revenueResult = await Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: 'cancelled' }, // Exclude cancelled orders
            paymentStatus: 'completed', // Payment must be completed
            totalAmount: { $exists: true, $ne: null, $gt: 0 } // Ensure valid amount
          }
        },
        {
          $group: {
            _id: null,
            total: { 
              $sum: { 
                $ifNull: ['$totalAmount', 0] 
              } 
            }
          }
        }
      ]);
      totalRevenue = revenueResult.length > 0 ? (revenueResult[0].total || 0) : 0;
      
      // Debug logging
      console.log('Revenue calculation:', {
        totalRevenue,
        resultLength: revenueResult.length,
        result: revenueResult
      });
    } catch (aggError) {
      console.error('Revenue aggregation error:', aggError);
      console.error('Aggregation error details:', aggError.message);
      // If aggregation fails, calculate manually
      try {
        const orders = await Order.find({
          orderStatus: { $ne: 'cancelled' },
          paymentStatus: 'completed'
        }).select('totalAmount orderStatus paymentStatus');
        
        console.log(`Found ${orders.length} non-cancelled orders with completed payment`);
        
        totalRevenue = orders.reduce((sum, order) => {
          // Double check: only count if not cancelled and payment completed
          if (order.orderStatus !== 'cancelled' && order.paymentStatus === 'completed') {
            const amount = order.totalAmount || 0;
            return sum + (typeof amount === 'number' && amount > 0 ? amount : 0);
          }
          return sum;
        }, 0);
        
        console.log('Manual revenue calculation:', totalRevenue);
      } catch (fallbackError) {
        console.error('Fallback revenue calculation error:', fallbackError);
        totalRevenue = 0;
      }
    }

    // Get recent orders with proper error handling
    let recentOrders = [];
    try {
      const orders = await Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('items.product', 'name price');
      
      // Convert to plain objects for JSON serialization
      recentOrders = orders.map(order => ({
        _id: order._id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        user: order.user ? {
          name: order.user.name,
          email: order.user.email
        } : null,
        items: order.items.map(item => ({
          product: item.product ? {
            name: item.product.name,
            price: item.product.price
          } : null,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }));
    } catch (populateError) {
      console.error('Error populating orders:', populateError);
      // Fallback: get orders without populate
      const orders = await Order.find()
        .sort({ orderDate: -1 })
        .limit(5)
        .select('totalAmount orderStatus orderDate user items');
      
      recentOrders = orders.map(order => ({
        _id: order._id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        user: null,
        items: order.items || []
      }));
    }

    res.json({
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue: totalRevenue || 0,
      recentOrders: recentOrders || []
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.name) console.error('Error name:', error.name);
    res.status(500).json({ 
      message: 'Server error while fetching admin statistics', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        stack: error.stack
      } : undefined
    });
  }
});

module.exports = router;
