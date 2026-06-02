const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById } = require('../controllers/menuController');
const { validateMenuItemId, validateMenuQuery } = require('../middleware/validate');

// GET /api/menu — Get all available menu items (optional category filter)
router.get('/', validateMenuQuery, getMenuItems);

// GET /api/menu/:id — Get single menu item
router.get('/:id', validateMenuItemId, getMenuItemById);

module.exports = router;
