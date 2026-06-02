const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.IO server with CORS configuration.
 * @param {import('http').Server} httpServer - HTTP server instance
 * @returns {import('socket.io').Server} Socket.IO server instance
 */
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Allow clients to join order-specific rooms for targeted updates
    socket.on('joinOrder', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`📦 Client ${socket.id} joined room: order:${orderId}`);
    });

    // Allow clients to leave order-specific rooms
    socket.on('leaveOrder', (orderId) => {
      socket.leave(`order:${orderId}`);
      console.log(`📦 Client ${socket.id} left room: order:${orderId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('🔌 Socket.IO initialized');
  return io;
};

/**
 * Get the Socket.IO server instance.
 * @returns {import('socket.io').Server} Socket.IO server instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
