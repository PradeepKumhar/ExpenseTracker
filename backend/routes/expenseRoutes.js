const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
const {
  addExpense,
  editExpense,
  deleteExpense,
  bulkAddExpenses,
  fetchExpenses,
} = require('../controllers/expenseController');

const router = express.Router();

/**
 * @route GET /
 * @desc Fetch all expenses for the authenticated user
 * @access Private
 */
router.get('/', authMiddleware, fetchExpenses);

/**
 * @route POST /
 * @desc Add a single expense
 * @access Private
 */
router.post('/', authMiddleware, addExpense);

/**
 * @route PUT /:id
 * @desc Edit an expense by ID
 * @access Private
 */
router.put('/:id', authMiddleware, editExpense);

/**
 * @route DELETE /:id
 * @desc Delete an expense by ID
 * @access Private
 */
router.delete('/:id', authMiddleware, deleteExpense);

/**
 * @route POST /bulk-add
 * @desc Add multiple expenses in bulk
 * @access Private
 */
router.post('/bulk-add', authMiddleware, bulkAddExpenses);

module.exports = router;
