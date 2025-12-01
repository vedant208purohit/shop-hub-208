const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { updateOrderStatuses } = require('../utils/orderStatusUpdater');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Update order statuses for all users before fetching (ensures fresh data)
    await updateOrderStatuses();

    // Fetch user's orders
    let orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ orderDate: -1 });

    // Add estimatedArrivalDate to orders that don't have it (for old orders)
    const today = new Date();
    for (const order of orders) {
      if (!order.estimatedArrivalDate && order.orderDate) {
        // Calculate estimated arrival (5-7 days from order date)
        const orderDate = new Date(order.orderDate);
        const estimatedArrival = new Date(orderDate);
        estimatedArrival.setDate(estimatedArrival.getDate() + Math.floor(Math.random() * 3) + 5);
        
        order.estimatedArrivalDate = estimatedArrival;
        await order.save();
      }
    }

    // Fetch updated orders (exclude cancelled orders)
    orders = await Order.find({ 
      user: req.user._id,
      orderStatus: { $ne: 'cancelled' }
    })
      .populate('items.product', 'name price image')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/cancelled
// @desc    Get user's cancelled orders
// @access  Private
router.get('/cancelled', protect, async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id,
      orderStatus: 'cancelled'
    })
      .populate('items.product', 'name price image')
      .sort({ cancelledAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order (user can cancel one day before estimated delivery)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order is already cancelled or delivered
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order' });
    }

    // Check if cancellation is allowed (one day before estimated delivery)
    if (!order.estimatedArrivalDate) {
      return res.status(400).json({ message: 'Estimated delivery date not available' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const estimatedArrival = new Date(order.estimatedArrivalDate);
    estimatedArrival.setHours(0, 0, 0, 0);
    
    const oneDayBefore = new Date(estimatedArrival);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);

    // Check if today is at least one day before estimated delivery
    if (today >= estimatedArrival) {
      return res.status(400).json({ 
        message: 'Cannot cancel order. Estimated delivery date has passed or is today' 
      });
    }

    if (today > oneDayBefore) {
      return res.status(400).json({ 
        message: 'Cannot cancel order. Cancellation allowed only one day before estimated delivery date' 
      });
    }

    // Cancel the order
    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order: await Order.findById(req.params.id).populate('items.product', 'name price image')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
        order.deliveredAt = Date.now();
      }
      if (orderStatus === 'cancelled') {
        order.cancelledAt = Date.now();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Update order statuses before fetching (ensures fresh data for all users)
    await updateOrderStatuses();

    let order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Add estimatedArrivalDate if it doesn't exist (for old orders)
    if (!order.estimatedArrivalDate && order.orderDate) {
      const orderDate = new Date(order.orderDate);
      const estimatedArrival = new Date(orderDate);
      estimatedArrival.setDate(estimatedArrival.getDate() + Math.floor(Math.random() * 3) + 5);
      
      order.estimatedArrivalDate = estimatedArrival;
      await order.save();
      
      // Refetch to get updated order
      order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name price image');
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    // Update order statuses for all users before fetching (ensures fresh data)
    await updateOrderStatuses();

    let orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ orderDate: -1 });

    // Add estimatedArrivalDate to orders that don't have it (for old orders)
    for (const order of orders) {
      if (!order.estimatedArrivalDate && order.orderDate) {
        const orderDate = new Date(order.orderDate);
        const estimatedArrival = new Date(orderDate);
        estimatedArrival.setDate(estimatedArrival.getDate() + Math.floor(Math.random() * 3) + 5);
        
        order.estimatedArrivalDate = estimatedArrival;
        await order.save();
      }
    }

    // Fetch updated orders
    orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
