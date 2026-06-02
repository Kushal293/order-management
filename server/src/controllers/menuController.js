const MenuItem = require('../models/MenuItem');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get all available menu items with optional category filter
 * @route   GET /api/menu
 * @access  Public
 */
const getMenuItems = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = { isAvailable: true };
    if (category) {
      filter.category = category;
    }

    const menuItems = await MenuItem.find(filter)
      .sort({ category: 1, name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
const getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).lean();

    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
};
