const request = require('supertest');
const app = require('../app');

describe('JWT Authentication Middleware', () => {
  it('should protect routes with valid JWT token', async () => {
    const res = await request(app)
      .get('/api/health/stats/month')
      .set('Authorization', 'Bearer invalidtoken'); // Invalid token
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('msg', 'Token is not valid');
  });

  it('should allow access with a valid JWT token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/health/stats/month')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
