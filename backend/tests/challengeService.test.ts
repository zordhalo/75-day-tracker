import { ChallengeService } from '../src/services/challengeService';
import prisma from '../src/utils/prisma';
import { ConflictError, NotFoundError, ValidationError } from '../src/utils/errors';

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

describe('ChallengeService', () => {
  let service: ChallengeService;

  beforeEach(() => {
    service = new ChallengeService();
    jest.clearAllMocks();
  });

  describe('createChallenge', () => {
    it('should create a new challenge for a user', async () => {
      const mockChallenge = {
        id: 'challenge-1',
        userId: 'user-1',
        startDate: new Date('2024-01-01'),
        currentDay: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.challenge.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.challenge.create as jest.Mock).mockResolvedValue(mockChallenge);

      const result = await service.createChallenge({ userId: 'user-1' });

      expect(result).toEqual(mockChallenge);
      expect(prisma.challenge.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          status: 'active',
        },
      });
      expect(prisma.challenge.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if user already has an active challenge', async () => {
      const existingChallenge = {
        id: 'challenge-1',
        userId: 'user-1',
        status: 'active',
      };

      (prisma.challenge.findFirst as jest.Mock).mockResolvedValue(existingChallenge);

      await expect(
        service.createChallenge({ userId: 'user-1' })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('getChallengeById', () => {
    it('should return challenge with details', async () => {
      const mockChallenge = {
        id: 'challenge-1',
        userId: 'user-1',
        startDate: new Date('2024-01-01'),
        currentDay: 5,
        status: 'active',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
        dailyLogs: [],
      };

      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(mockChallenge);

      const result = await service.getChallengeById('challenge-1');

      expect(result).toEqual(mockChallenge);
      expect(prisma.challenge.findUnique).toHaveBeenCalledWith({
        where: { id: 'challenge-1' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          dailyLogs: {
            orderBy: {
              date: 'desc',
            },
          },
        },
      });
    });

    it('should throw NotFoundError if challenge does not exist', async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getChallengeById('nonexistent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('submitDailyLog', () => {
    const mockChallenge = {
      id: 'challenge-1',
      userId: 'user-1',
      startDate: new Date('2024-01-01'),
      currentDay: 0,
      status: 'active',
      dailyLogs: [],
    };

    beforeEach(() => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(mockChallenge);
    });

    it('should create a daily log with all tasks', async () => {
      const tasks = {
        diet: true,
        workout1: true,
        workout2: true,
        water: true,
        reading: true,
        photo: true,
      };

      const mockDailyLog = {
        id: 'log-1',
        challengeId: 'challenge-1',
        date: new Date('2024-01-01'),
        ...tasks,
        completedAt: new Date(),
      };

      (prisma.dailyLog.upsert as jest.Mock).mockResolvedValue(mockDailyLog);
      (prisma.challenge.update as jest.Mock).mockResolvedValue({
        ...mockChallenge,
        currentDay: 1,
      });

      const result = await service.submitDailyLog(
        'challenge-1',
        new Date('2024-01-01'),
        tasks
      );

      expect(result).toEqual(mockDailyLog);
      expect(prisma.dailyLog.upsert).toHaveBeenCalled();
    });

    it('should throw ValidationError for future dates', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await expect(
        service.submitDailyLog('challenge-1', futureDate, {})
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for dates before challenge start', async () => {
      const pastDate = new Date('2023-12-31');

      await expect(
        service.submitDailyLog('challenge-1', pastDate, {})
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if challenge is not active', async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        ...mockChallenge,
        status: 'completed',
      });

      await expect(
        service.submitDailyLog('challenge-1', new Date(), {})
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getProgress', () => {
    it('should calculate progress statistics correctly', async () => {
      const mockChallenge = {
        id: 'challenge-1',
        userId: 'user-1',
        startDate: new Date('2024-01-01'),
        currentDay: 3,
        status: 'active',
        dailyLogs: [
          {
            date: new Date('2024-01-01'),
            diet: true,
            workout1: true,
            workout2: true,
            water: true,
            reading: true,
            photo: true,
          },
          {
            date: new Date('2024-01-02'),
            diet: true,
            workout1: true,
            workout2: true,
            water: true,
            reading: true,
            photo: true,
          },
          {
            date: new Date('2024-01-03'),
            diet: true,
            workout1: true,
            workout2: true,
            water: true,
            reading: true,
            photo: true,
          },
        ],
      };

      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(mockChallenge);

      const result = await service.getProgress('challenge-1');

      expect(result.currentDay).toBe(3);
      expect(result.totalDays).toBe(75);
      expect(result.completionPercentage).toBe(4);
      expect(result.longestStreak).toBe(3);
      expect(result.tasksCompletedByCategory.diet).toBe(3);
    });

    it('should throw NotFoundError if challenge does not exist', async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.getProgress('nonexistent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteChallenge', () => {
    it('should delete a challenge', async () => {
      const mockChallenge = {
        id: 'challenge-1',
        userId: 'user-1',
      };

      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(mockChallenge);
      (prisma.challenge.delete as jest.Mock).mockResolvedValue(mockChallenge);

      const result = await service.deleteChallenge('challenge-1');

      expect(result.message).toBe('Challenge deleted successfully');
      expect(prisma.challenge.delete).toHaveBeenCalledWith({
        where: { id: 'challenge-1' },
      });
    });

    it('should throw NotFoundError if challenge does not exist', async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.deleteChallenge('nonexistent')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getDailyLog', () => {
    it('should return daily log for a specific date', async () => {
      const mockLog = {
        id: 'log-1',
        challengeId: 'challenge-1',
        date: new Date('2024-01-01'),
        diet: true,
        workout1: false,
        workout2: false,
        water: false,
        reading: false,
        photo: false,
      };

      (prisma.dailyLog.findUnique as jest.Mock).mockResolvedValue(mockLog);

      const result = await service.getDailyLog('challenge-1', new Date('2024-01-01'));

      expect(result).toEqual(mockLog);
    });
  });
});
