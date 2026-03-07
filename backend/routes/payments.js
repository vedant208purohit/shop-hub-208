const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// Initialize Razorpay (lazy initialization)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay API keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Validate amount is reasonable (max ₹10,00,000)
    if (amount > 1000000) {
      console.error('Amount too high:', amount);
      return res.status(400).json({ message: 'Amount exceeds maximum limit' });
    }

    // Convert amount to paise 
    // Amount should be in rupees, so multiply by 100 to get paise
    const amountInPaise = Math.round(amount * 100);
    
    console.log('Creating Razorpay order:', { amount, amountInPaise, currency });

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      // Enable all payment methods including international cards
      notes: {
        description: 'Shop Hub Order'
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/payments/verify-payment
// @desc    Verify Razorpay payment and create order
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      items,
      shippingAddress,
      totalAmount
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify payment signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Calculate estimated arrival date (5-7 days from order date)
    const estimatedArrival = new Date();
    estimatedArrival.setDate(estimatedArrival.getDate() + Math.floor(Math.random() * 3) + 5); // 5-7 days

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderStatus: 'pending',
      estimatedArrivalDate: estimatedArrival,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

