const express = require('express');
const Product = require('../models/Product');
const Revenue = require('../models/Revenue');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET /api/analytics/dashboard — Dashboard stats and chart data
router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Calculate totals from products
    const totalProducts = products.length;
    const productRevenue = products.reduce((sum, p) => sum + (p.salesData?.revenue || 0), 0);
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

    // Fetch manual revenue entries for this user, current year
    const currentYear = new Date().getFullYear();
    const manualRevenue = await Revenue.aggregate([
      { $match: { createdBy: req.userId, year: currentYear } },
      { $group: { _id: '$month', total: { $sum: '$amount' } } },
    ]);

    const manualRevenueMap = {};
    let totalManualRevenue = 0;
    manualRevenue.forEach((item) => {
      manualRevenueMap[item._id] = item.total;
      totalManualRevenue += item.total;
    });

    const totalRevenue = productRevenue + totalManualRevenue;

    // Build 12-month chart with both product + manual revenue
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = months.map((m, i) => {
      // Distribute product revenue across months with a growth curve
      const factor = (i + 1) / months.length;
      const productMonthly = Math.round((productRevenue / months.length) * (0.6 + factor * 0.8));
      // Add manual revenue for this month
      const manual = manualRevenueMap[m] || 0;
      return productMonthly + manual;
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
