const request = require('supertest');
const app = require('../app');
const { createTestUserAndGetToken } = require('./setup');

describe('Health Data', () => {
  let token;

  beforeAll(async () => {
    token = await createTestUserAndGetToken();
  });

  describe('Add Health Data', () => {
    it('should add health data successfully', async () => {
      const res = await request(app)
        .post('/api/health')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bloodSugar: 110,
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.healthData).toHaveProperty('bloodSugar', 110);
    });

    it('should return error for invalid health data', async () => {
      const res = await request(app)
        .post('/api/health')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bloodSugar: -1 // Invalid blood sugar value
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('Get Health Stats', () => {
    it('should get health stats for the current month', async () => {
      const res = await request(app)
        .get('/api/health/stats/month')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return no data for empty stats', async () => {
      const res = await request(app)
        .get('/api/health/stats/year')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0); // No data found for the year
    });

    it('should return error for invalid period', async () => {
      const res = await request(app)
        .get('/api/health/stats/invalid')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('msg', 'Invalid period. Use "month" or "year".');
    });
  });
});
