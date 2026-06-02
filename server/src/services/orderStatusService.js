const Order = require('../models/Order');
const { getIO } = require('../config/socket');
const { ORDER_STATUSES, STATUS_PROGRESSION, SIMULATION_DELAYS } = require('../utils/constants');

// In-memory store for active simulation timers (orderId -> timeoutId)
const activeSimulations = new Map();

/**
 * Start automatic order status progression simulation.
 * Advances status through: Order Received → Preparing → Out for Delivery → Delivered
 *
 * @param {string} orderId - The order ID to simulate
 */
const startStatusSimulation = (orderId) => {
  // Clear any existing simulation for this order
  stopSimulation(orderId);

  const simulate = async (currentStatusIndex) => {
    const nextStatusIndex = currentStatusIndex + 1;

    // Stop if we've reached the end of progression
    if (nextStatusIndex >= STATUS_PROGRESSION.length) {
      activeSimulations.delete(orderId);
      return;
    }

    const nextStatus = STATUS_PROGRESSION[nextStatusIndex];
    const delay = SIMULATION_DELAYS[nextStatus];

    if (!delay) {
      activeSimulations.delete(orderId);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const order = await Order.findById(orderId);

        // Stop simulation if order was cancelled or doesn't exist
        if (!order || order.status === ORDER_STATUSES.CANCELLED) {
          activeSimulations.delete(orderId);
          return;
        }

        // Update order status
        order.status = nextStatus;
        order.statusHistory.push({
          status: nextStatus,
          timestamp: new Date(),
        });
        await order.save();

        // Emit real-time update via Socket.IO
        try {
          const io = getIO();
          io.to(`order:${orderId}`).emit('orderStatusUpdate', {
            orderId,
            status: nextStatus,
            statusHistory: order.statusHistory,
            updatedAt: new Date(),
          });
        } catch (socketError) {
          // Socket might not be initialized in test environment
          console.log('Socket.IO not available for status update emission');
        }

        console.log(`📦 Order ${order.orderNumber}: ${nextStatus}`);

        // Continue to next status
        simulate(nextStatusIndex);
      } catch (error) {
        console.error(`Error simulating status for order ${orderId}:`, error.message);
        activeSimulations.delete(orderId);
      }
    }, delay);

    activeSimulations.set(orderId, timeoutId);
  };

  // Start from "Order Received" (index 0)
  simulate(0);
};

/**
 * Stop an active simulation for an order.
 * @param {string} orderId - The order ID to stop simulation for
 */
const stopSimulation = (orderId) => {
  const timeoutId = activeSimulations.get(orderId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    activeSimulations.delete(orderId);
  }
};

/**
 * Stop all active simulations (used in cleanup/testing).
 */
const stopAllSimulations = () => {
  for (const [orderId, timeoutId] of activeSimulations) {
    clearTimeout(timeoutId);
  }
  activeSimulations.clear();
};

module.exports = {
  startStatusSimulation,
  stopSimulation,
  stopAllSimulations,
};
