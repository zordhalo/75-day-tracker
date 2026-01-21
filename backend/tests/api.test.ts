import request from 'supertest';
import app from '../src/app';
import prisma from '../src/utils/prisma';

// Mock Prisma client
jest.mock('../src/utils/prisma', () => ({
  __esModule: true,
  default: {
    challenge: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    dailyLog: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

describe('Challenge API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: '75 Hard Tracker API is running',
      });
    });
  });

  describe('POST /api/challenges', () => {
    it('should return 400 if userId is missing', async () => {
      const response = await request(app)
        .post('/api/challenges')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/challenges/:id', () => {
    it('should return 404 for non-existent challenge', async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/challenges/nonexistent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
