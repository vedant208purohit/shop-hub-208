const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <-- Added for ID validation
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 50 } = req.query;
    
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
      default:
        sortOption = { name: 1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  // --- Validation Check Added ---
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  // ------------------------------

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    // Removed the 'kind' check as validation handles it
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, image, images, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      images,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  // --- Validation Check Added ---
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  // ------------------------------

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/products/:id
// @desc    Partially update a product (e.g., update stock or price only)
// @access  Private/Admin
router.patch('/:id', protect, admin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Only update fields that are provided
    const allowedUpdates = ['name', 'description', 'price', 'category', 'stock', 'image', 'rating'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => {
      product[update] = req.body[update];
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  // --- Validation Check Added ---
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  // ------------------------------
  
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;