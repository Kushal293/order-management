import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { updateOrderStatus } from '../features/order/orderSlice';
import { SOCKET_URL } from '../utils/constants';

/**
 * Custom hook for Socket.IO connection and order status updates.
 * Automatically connects to the server and handles real-time updates.
 *
 * @param {string} [orderId] - Optional order ID to subscribe to specific order updates
 * @returns {{ isConnected: boolean }}
 */
const useSocket = (orderId) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      isConnectedRef.current = true;
      console.log('🔌 Socket connected:', socket.id);

      // Join order room if orderId is provided
      if (orderId) {
        socket.emit('joinOrder', orderId);
      }
    });

    socket.on('disconnect', () => {
      isConnectedRef.current = false;
      console.log('🔌 Socket disconnected');
    });

    // Listen for order status updates
    socket.on('orderStatusUpdate', (data) => {
      console.log('📦 Order status update received:', data);
      dispatch(updateOrderStatus(data));
    });

    socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
    });

    // Cleanup on unmount
    return () => {
      if (orderId) {
        socket.emit('leaveOrder', orderId);
      }
      socket.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    };
  }, [orderId, dispatch]);

  const joinOrder = useCallback((id) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinOrder', id);
    }
  }, []);

  const leaveOrder = useCallback((id) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leaveOrder', id);
    }
  }, []);

  return {
    isConnected: isConnectedRef.current,
    joinOrder,
    leaveOrder,
  };
};

export default useSocket;
