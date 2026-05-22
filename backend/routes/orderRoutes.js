const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET /api/orders — Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/orders/stats — Get order stats for charting
router.get('/stats', async (req, res) => {
  try {
    const orders = await Order.find().lean();
    
    // Group by status
    const statusCounts = {
      Delivered: 0,
      Processing: 0,
      Shipped: 0,
      Cancelled: 0
    };
    
    orders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      }
    });

    res.json({
      statusCounts: [
        { status: 'Delivered', count: statusCounts.Delivered },
        { status: 'Processing', count: statusCounts.Processing },
        { status: 'Shipped', count: statusCounts.Shipped },
        { status: 'Cancelled', count: statusCounts.Cancelled },
      ],
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
