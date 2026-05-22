const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Revenue = require('../models/Revenue');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // SEED DUMMY DATA FOR NEW ACCOUNT
    try {
      const p1 = await Product.create({ name: 'Smart Watch Pro', category: 'Wearables', price: 199, stock: 45, createdBy: user._id, salesData: { unitsSold: 120, revenue: 23880 } });
      const p2 = await Product.create({ name: 'Wireless Earbuds', category: 'Electronics', price: 89, stock: 12, createdBy: user._id, salesData: { unitsSold: 300, revenue: 26700 } });
      const p3 = await Product.create({ name: 'Ergonomic Desk Chair', category: 'Furniture', price: 249, stock: 8, createdBy: user._id, salesData: { unitsSold: 45, revenue: 11205 } });

      const currentYear = new Date().getFullYear();
      await Revenue.create({ month: 'Jan', year: currentYear, amount: 4500, note: 'New Year Sales', createdBy: user._id });
      await Revenue.create({ month: 'Feb', year: currentYear, amount: 5200, note: 'Valentine Promo', createdBy: user._id });
      await Revenue.create({ month: 'Mar', year: currentYear, amount: 6100, note: 'Spring Collection', createdBy: user._id });

      await Order.create({ orderId: 'ORD-' + Math.floor(Math.random() * 1000000), customer: { name: 'Alice Smith', email: 'alice@example.com' }, totalAmount: 199, status: 'Delivered', items: [{ product: p1._id, quantity: 1, price: 199 }]});
      await Order.create({ orderId: 'ORD-' + Math.floor(Math.random() * 1000000), customer: { name: 'Bob Johnson', email: 'bob@example.com' }, totalAmount: 178, status: 'Processing', items: [{ product: p2._id, quantity: 2, price: 89 }]});
      await Order.create({ orderId: 'ORD-' + Math.floor(Math.random() * 1000000), customer: { name: 'Charlie Davis', email: 'charlie@example.com' }, totalAmount: 249, status: 'Shipped', items: [{ product: p3._id, quantity: 1, price: 249 }]});
    } catch(seedErr) {
      console.error('Error seeding dummy data:', seedErr);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      user.password = password; // Will be hashed automatically by the pre-save hook
    }

    await user.save();
    res.json({
      message: 'Profile updated successfully!',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
