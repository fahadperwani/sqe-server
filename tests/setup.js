const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); // Import the app, not the server!
const { JWT_SECRET } = require('../config');
// jest.setup.js
require('dotenv').config();


// Create a test user and get a token
const createTestUserAndGetToken = async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
  return res.body.token;
};

beforeAll(async () => {
    
    console.log("mongo",process.env.MONGO_URI)
  // Set up the MongoDB connection before running tests
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Disconnect from MongoDB after all tests
  await mongoose.connection.close();
});

module.exports = { createTestUserAndGetToken };
