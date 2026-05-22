const express = require('express');
const Revenue = require('../models/Revenue');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET /api/revenue — Get all revenue entries for the logged-in user
router.get('/', async (req, res) => {
  try {
    const entries = await Revenue.find({ createdBy: req.userId })
      .sort({ year: -1, createdAt: -1 })
      .lean();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET /api/revenue/chart — Aggregated monthly revenue for chart
router.get('/chart', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Aggregate all entries for the given year, grouped by month
    const aggregation = await Revenue.aggregate([
      { $match: { createdBy: req.userId, year } },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Build a map from month -> total
    const monthTotals = {};
    aggregation.forEach((item) => {
      monthTotals[item._id] = item.total;
    });

    // Return ordered arrays
    const labels = months;
    const data = months.map((m) => monthTotals[m] || 0);

    res.json({ year, labels, data });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST /api/revenue — Add a new revenue entry
router.post('/', async (req, res) => {
  try {
    const { month, year, amount, note } = req.body;

    if (!month || !year || amount === undefined) {
      return res.status(400).json({ message: 'month, year, and amount are required.' });
    }

    const entry = await Revenue.create({
      month,
      year: parseInt(year),
      amount: parseFloat(amount),
      note: note || '',
      createdBy: req.userId,
    });

    res.status(201).json({ message: 'Revenue entry added.', entry });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE /api/revenue/:id — Delete a revenue entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Revenue.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found.' });
    }

    res.json({ message: 'Revenue entry deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
