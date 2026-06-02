const request = require('supertest');
const app = require('../src/app');
const MenuItem = require('../src/models/MenuItem');
const Order = require('../src/models/Order');

// Test setup — uses mongodb-memory-server via setup.js
require('./setup');

describe('Order API', () => {
  let menuItem1, menuItem2;

  beforeEach(async () => {
    menuItem1 = await MenuItem.create({
      name: 'Test Pizza',
      description: 'Test pizza description',
      price: 12.99,
      image: 'https://example.com/pizza.jpg',
      category: 'Pizza',
      isAvailable: true,
    });

    menuItem2 = await MenuItem.create({
      name: 'Test Burger',
      description: 'Test burger description',
      price: 11.99,
      image: 'https://example.com/burger.jpg',
      category: 'Burger',
      isAvailable: true,
    });
  });

  const validOrderData = () => ({
    items: [
      { menuItem: menuItem1._id.toString(), quantity: 2 },
      { menuItem: menuItem2._id.toString(), quantity: 1 },
    ],
    customer: {
      name: 'John Doe',
      address: '123 Main Street, Apt 4B, New York, NY 10001',
      phone: '1234567890',
    },
  });

  describe('POST /api/orders', () => {
    it('should create a new order with valid data', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toMatch(/^ORD-[A-F0-9]{6}$/);
      expect(res.body.data.status).toBe('Order Received');
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.totalAmount).toBe(12.99 * 2 + 11.99 * 1);
      expect(res.body.data.statusHistory).toHaveLength(1);
    });

    it('should calculate prices server-side', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      // Verify prices match the menu items, not client-sent data
      const pizza = res.body.data.items.find((i) => i.name === 'Test Pizza');
      expect(pizza.price).toBe(12.99);
      expect(pizza.subtotal).toBe(25.98);
    });

    it('should reject empty items array', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [],
          customer: validOrderData().customer,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing customer name', async () => {
      const data = validOrderData();
      data.customer.name = '';

      const res = await request(app).post('/api/orders').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing customer address', async () => {
      const data = validOrderData();
      data.customer.address = '';

      const res = await request(app).post('/api/orders').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid phone number', async () => {
      const data = validOrderData();
      data.customer.phone = 'not-a-phone';

      const res = await request(app).post('/api/orders').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject unavailable menu items', async () => {
      const unavailableItem = await MenuItem.create({
        name: 'Unavailable Dish',
        description: 'This dish is unavailable',
        price: 9.99,
        image: 'https://example.com/unavailable.jpg',
        category: 'Side',
        isAvailable: false,
      });

      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [{ menuItem: unavailableItem._id.toString(), quantity: 1 }],
          customer: validOrderData().customer,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid menu item IDs', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [{ menuItem: '507f1f77bcf86cd799439011', quantity: 1 }],
          customer: validOrderData().customer,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject quantity less than 1', async () => {
      const data = validOrderData();
      data.items[0].quantity = 0;

      const res = await request(app).post('/api/orders').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject quantity greater than 50', async () => {
      const data = validOrderData();
      data.items[0].quantity = 51;

      const res = await request(app).post('/api/orders').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return an order by ID', async () => {
      // Create an order first
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      const res = await request(app).get(`/api/orders/${orderId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(orderId);
      expect(res.body.data.customer.name).toBe('John Doe');
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/orders/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid order ID format', async () => {
      const res = await request(app).get('/api/orders/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // Create two orders
      await request(app).post('/api/orders').send(validOrderData());
      await request(app).post('/api/orders').send(validOrderData());

      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should return orders sorted by creation date (newest first)', async () => {
      await request(app).post('/api/orders').send(validOrderData());
      await request(app).post('/api/orders').send(validOrderData());

      const res = await request(app).get('/api/orders');

      const dates = res.body.data.map((o) => new Date(o.createdAt).getTime());
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
    });

    it('should filter orders by status', async () => {
      await request(app).post('/api/orders').send(validOrderData());

      const res = await request(app).get('/api/orders?status=Order Received');

      expect(res.status).toBe(200);
      expect(res.body.data.every((o) => o.status === 'Order Received')).toBe(true);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status with valid transition', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Preparing' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Preparing');
      expect(res.body.data.statusHistory).toHaveLength(2); // Initial + update
    });

    it('should reject invalid status transition', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      // Try to skip from "Order Received" to "Delivered"
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Delivered' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid status value', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'InvalidStatus' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .patch(`/api/orders/${fakeId}/status`)
        .send({ status: 'Preparing' });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id/cancel', () => {
    it('should cancel an order with status "Order Received"', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      const res = await request(app).patch(`/api/orders/${orderId}/cancel`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Cancelled');
    });

    it('should cancel an order with status "Preparing"', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      // First move to Preparing
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Preparing' });

      const res = await request(app).patch(`/api/orders/${orderId}/cancel`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Cancelled');
    });

    it('should reject cancellation of order "Out for Delivery"', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      // Move through statuses
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Preparing' });
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Out for Delivery' });

      const res = await request(app).patch(`/api/orders/${orderId}/cancel`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject cancellation of delivered order', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      // Move through all statuses
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Preparing' });
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Out for Delivery' });
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'Delivered' });

      const res = await request(app).patch(`/api/orders/${orderId}/cancel`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject cancellation of already cancelled order', async () => {
      const createRes = await request(app)
        .post('/api/orders')
        .send(validOrderData());

      const orderId = createRes.body.data._id;

      // Cancel first
      await request(app).patch(`/api/orders/${orderId}/cancel`);

      // Try to cancel again
      const res = await request(app).patch(`/api/orders/${orderId}/cancel`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
