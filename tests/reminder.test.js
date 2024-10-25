const request = require('supertest');
const app = require('../app');
const { createTestUserAndGetToken } = require('./setup');

describe('Reminders', () => {
  let token;

  beforeAll(async () => {
    token = await createTestUserAndGetToken();
  });

  describe('Add Reminder', () => {
    it('should add a reminder successfully', async () => {
      const res = await request(app)
        .post('/api/reminder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'Doctor appointment',
          date: '2024-10-20',
          type: 'appointment'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.reminder).toHaveProperty('message', 'Doctor appointment');
    });

    it('should return error for missing fields', async () => {
      const res = await request(app)
        .post('/api/reminder')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'Incomplete reminder'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('Get Reminders', () => {
    it('should get user reminders', async () => {
      const res = await request(app)
        .get('/api/reminder')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return empty list if no reminders found', async () => {
      const res = await request(app)
        .get('/api/reminder')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0);
    });
  });
});
