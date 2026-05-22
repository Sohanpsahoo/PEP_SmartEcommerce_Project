const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, 'Month is required'],
      enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound index so we can quickly aggregate by month/year per user
revenueSchema.index({ createdBy: 1, year: 1, month: 1 });

module.exports = mongoose.model('Revenue', revenueSchema);
