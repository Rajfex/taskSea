const { Category } = require('../models');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category (admin only)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name'
      });
    }

    // Check if category exists
    const existingCategory = await Category.findOne({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Create category
    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};
