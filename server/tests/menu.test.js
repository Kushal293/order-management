const request = require('supertest');
const app = require('../src/app');
const MenuItem = require('../src/models/MenuItem');

// Test setup — uses mongodb-memory-server via setup.js
require('./setup');

describe('Menu API', () => {
  // Seed menu items before each test
  let pizzaItem, burgerItem, unavailableItem;

  beforeEach(async () => {
    pizzaItem = await MenuItem.create({
      name: 'Test Margherita',
      description: 'Classic pizza with tomato and mozzarella',
      price: 12.99,
      image: 'https://example.com/pizza.jpg',
      category: 'Pizza',
      isAvailable: true,
    });

    burgerItem = await MenuItem.create({
      name: 'Test Burger',
      description: 'Juicy beef burger with all the fixings',
      price: 11.99,
      image: 'https://example.com/burger.jpg',
      category: 'Burger',
      isAvailable: true,
    });

    unavailableItem = await MenuItem.create({
      name: 'Unavailable Item',
      description: 'This item is currently unavailable',
      price: 9.99,
      image: 'https://example.com/unavailable.jpg',
      category: 'Side',
      isAvailable: false,
    });
  });

  describe('GET /api/menu', () => {
    it('should return all available menu items', async () => {
      const res = await request(app).get('/api/menu');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2); // Only available items
      expect(res.body.data).toHaveLength(2);
    });

    it('should not include unavailable items', async () => {
      const res = await request(app).get('/api/menu');

      const names = res.body.data.map((item) => item.name);
      expect(names).not.toContain('Unavailable Item');
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/menu?category=Pizza');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('Test Margherita');
    });

    it('should return empty array for category with no items', async () => {
      const res = await request(app).get('/api/menu?category=Dessert');

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toHaveLength(0);
    });

    it('should reject invalid category', async () => {
      const res = await request(app).get('/api/menu?category=InvalidCategory');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item by ID', async () => {
      const res = await request(app).get(`/api/menu/${pizzaItem._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Margherita');
      expect(res.body.data.price).toBe(12.99);
    });

    it('should return 404 for non-existent menu item', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/menu/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/menu/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
