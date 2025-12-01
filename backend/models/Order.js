const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay'],
    default: 'razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  estimatedArrivalDate: {
    type: Date,
  },
  deliveredAt: Date,
  cancelledAt: Date,
});

module.exports = mongoose.model('Order', orderSchema);
