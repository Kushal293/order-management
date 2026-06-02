const { body, param, query, validationResult } = require('express-validator');
const { ORDER_STATUSES, MENU_CATEGORIES } = require('../utils/constants');

/**
 * Middleware to check validation results and return errors.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * Validation rules for order placement.
 */
const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Menu item ID is required')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),

  body('items.*.quantity')
    .isInt({ min: 1, max: 50 })
    .withMessage('Quantity must be between 1 and 50'),

  body('customer')
    .isObject()
    .withMessage('Customer information is required'),

  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('customer.address')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ min: 5, max: 300 })
    .withMessage('Address must be between 5 and 300 characters'),

  body('customer.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),

  handleValidationErrors,
];

/**
 * Validation rules for updating order status.
 */
const validateUpdateStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ORDER_STATUSES))
    .withMessage(`Status must be one of: ${Object.values(ORDER_STATUSES).join(', ')}`),

  handleValidationErrors,
];

/**
 * Validation rules for getting an order by ID.
 */
const validateOrderId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),

  handleValidationErrors,
];

/**
 * Validation rules for getting a menu item by ID.
 */
const validateMenuItemId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid menu item ID format'),

  handleValidationErrors,
];

/**
 * Validation rules for menu query params.
 */
const validateMenuQuery = [
  query('category')
    .optional()
    .isIn(MENU_CATEGORIES)
    .withMessage(`Category must be one of: ${MENU_CATEGORIES.join(', ')}`),

  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateCreateOrder,
  validateUpdateStatus,
  validateOrderId,
  validateMenuItemId,
  validateMenuQuery,
};
