const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (admin only in a real app)
router.post('/', protect, createCategory);

module.exports = router;
