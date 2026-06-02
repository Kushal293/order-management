const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { stopAllSimulations } = require('../src/services/orderStatusService');

let mongoServer;

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // Stop any running simulations
  stopAllSimulations();
});

// Close connection and stop server after all tests
afterAll(async () => {
  stopAllSimulations();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
