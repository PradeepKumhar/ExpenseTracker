const mongoose = require('mongoose');

// Expense schema with user reference, amount, category, description, and date
const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
