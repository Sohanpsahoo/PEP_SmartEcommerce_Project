const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET /api/analytics/dashboard — Dashboard stats and chart data
router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Calculate totals
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + (p.salesData?.revenue || 0), 0);
    const totalUnitsSold = products.reduce((sum, p) => sum + (p.salesData?.unitsSold || 0), 0);
    const lowStockProducts = products.filter((p) => p.stock <= 15);

    // Top 5 products by revenue
    const topProducts = [...products]
      .sort((a, b) => (b.salesData?.revenue || 0) - (a.salesData?.revenue || 0))
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        revenue: p.salesData?.revenue || 0,
        unitsSold: p.salesData?.unitsSold || 0,
      }));

    // Monthly revenue mock breakdown (simulated from product data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const monthlyRevenue = months.map((_, i) => {
      // Distribute total revenue across months with a growth curve
      const factor = (i + 1) / months.length;
      return Math.round((totalRevenue / months.length) * (0.6 + factor * 0.8));
    });

    res.json({
      stats: {
        totalRevenue,
        totalProducts,
        totalUnitsSold,
        lowStockCount: lowStockProducts.length,
      },
      topProducts,
      revenueChart: {
        labels: months,
        data: monthlyRevenue,
      },
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p._id,
        name: p.name,
        stock: p.stock,
        category: p.category,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
