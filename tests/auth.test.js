const request = require('supertest');
const app = require('../app');
const { createTestUserAndGetToken } = require('./setup');

describe('Authentication', () => {
  let token;

  beforeAll(async () => {
    token = await createTestUserAndGetToken();
  });

  jest.setTimeout(10000);

  describe('Signup', () => {
    it('should sign up a new user successfully', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not sign up a user with an existing email', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        name: 'John Doe',
        email: 'test@example.com', // Email already exists
        password: 'password123'
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'User already exists');
    });

    it('should return error if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'missingpassword@example.com'
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('Login', () => {
    it('should log in a user successfully', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return error if password is incorrect', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });

    it('should return error if user does not exist', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid credentials');
    });
  });
});
