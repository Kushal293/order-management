const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const {
  validateCreateOrder,
  validateUpdateStatus,
  validateOrderId,
} = require('../middleware/validate');

// POST /api/orders — Place a new order
router.post('/', validateCreateOrder, createOrder);

// GET /api/orders — Get all orders (paginated, filterable)
router.get('/', getOrders);

// GET /api/orders/:id — Get order by ID
router.get('/:id', validateOrderId, getOrderById);

// PATCH /api/orders/:id/status — Update order status
router.patch('/:id/status', validateUpdateStatus, updateOrderStatus);

// PATCH /api/orders/:id/cancel — Cancel an order
router.patch('/:id/cancel', validateOrderId, cancelOrder);

module.exports = router;
