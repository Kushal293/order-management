const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { AppError } = require('../middleware/errorHandler');
const { ORDER_STATUSES, STATUS_TRANSITIONS } = require('../utils/constants');
const { startStatusSimulation, stopSimulation } = require('../services/orderStatusService');

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, customer } = req.body;

    // Fetch all referenced menu items and verify they exist & are available
    const menuItemIds = items.map((item) => item.menuItem);
    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      isAvailable: true,
    }).lean();

    // Check if all requested items were found
    if (menuItems.length !== menuItemIds.length) {
      const foundIds = menuItems.map((m) => m._id.toString());
      const missingIds = menuItemIds.filter((id) => !foundIds.includes(id));
      throw new AppError(
        `The following menu items are unavailable or not found: ${missingIds.join(', ')}`,
        400
      );
    }

    // Build order items with server-side price calculation (prevents price tampering)
    const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));
    const orderItems = items.map((item) => {
      const menuItem = menuItemMap.get(item.menuItem);
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: menuItem.price * item.quantity,
      };
    });

    // Calculate total server-side
    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Create the order
    const order = await Order.create({
      items: orderItems,
      customer,
      totalAmount,
      status: ORDER_STATUSES.ORDER_RECEIVED,
    });

    // Start automatic status simulation
    startStatusSimulation(order._id.toString());

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders with optional status filter and pagination
 * @route   GET /api/orders
 * @access  Public
 */
const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Public
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate status transition
    const allowedTransitions = STATUS_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(status)) {
      throw new AppError(
        `Cannot transition from "${order.status}" to "${status}". Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`,
        400
      );
    }

    // Update status and add to history
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
    });

    await order.save();

    // Emit real-time update
    try {
      const { getIO } = require('../config/socket');
      const io = getIO();
      io.to(`order:${order._id}`).emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.status,
        statusHistory: order.statusHistory,
        updatedAt: new Date(),
      });
    } catch (socketError) {
      // Socket might not be initialized in test environment
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order
 * @route   PATCH /api/orders/:id/cancel
 * @access  Public
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Can only cancel if not already out for delivery or delivered
    const nonCancellableStatuses = [
      ORDER_STATUSES.OUT_FOR_DELIVERY,
      ORDER_STATUSES.DELIVERED,
      ORDER_STATUSES.CANCELLED,
    ];

    if (nonCancellableStatuses.includes(order.status)) {
      throw new AppError(
        `Cannot cancel order with status "${order.status}". Orders can only be cancelled before they are out for delivery.`,
        400
      );
    }

    // Stop any running simulation
    stopSimulation(order._id.toString());

    // Update status
    order.status = ORDER_STATUSES.CANCELLED;
    order.statusHistory.push({
      status: ORDER_STATUSES.CANCELLED,
      timestamp: new Date(),
    });

    await order.save();

    // Emit real-time update
    try {
      const { getIO } = require('../config/socket');
      const io = getIO();
      io.to(`order:${order._id}`).emit('orderStatusUpdate', {
        orderId: order._id,
        status: ORDER_STATUSES.CANCELLED,
        statusHistory: order.statusHistory,
        updatedAt: new Date(),
      });
    } catch (socketError) {
      // Socket might not be initialized in test environment
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  cancelOrder,
};
