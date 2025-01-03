const Expense = require("../models/Expense");

const fetchExpenses = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Unauthorized access' });
    }

    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1 });

    if (!expenses.length) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'No expenses found' });
    }

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'All fields (amount, category, description, date) are required'
      });
    }

    if (isNaN(amount)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Amount must be a valid number'
      });
    }

    const expense = new Expense({
      user: req.userId,
      amount,
      category,
      description,
      date: new Date(date)
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

const editExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to access this expense'
      });
    }

    expense.amount = amount;
    expense.category = category;
    expense.description = description;
    expense.date = new Date(date);

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.userId) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to delete this expense'
      });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

const bulkAddExpenses = async (req, res) => {
  try {
    const expenses = req.body.expenses;

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Expenses array is required and cannot be empty'
      });
    }

    const validExpenses = expenses.filter(exp => exp.amount && exp.category && exp.date);
    const invalidExpenses = expenses.filter(exp => !exp.amount || !exp.category || !exp.date);

    if (validExpenses.length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'No valid expenses to add'
      });
    }

    const insertedExpenses = await Expense.insertMany(validExpenses.map(exp => ({
      user: req.userId,
      ...exp,
      date: new Date(exp.date)
    })));

    res.status(201).json({ insertedExpenses, invalidExpenses });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
};

module.exports = { fetchExpenses, addExpense, editExpense, deleteExpense, bulkAddExpenses };
