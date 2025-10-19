import prisma from '../utils/prisma';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors';

export interface CreateChallengeData {
  userId: string;
  startDate?: Date;
}

export interface DailyTasksData {
  diet?: boolean;
  workout1?: boolean;
  workout2?: boolean;
  water?: boolean;
  reading?: boolean;
  photo?: boolean;
  photoUrl?: string;
  notes?: string;
}

export interface ProgressStats {
  currentDay: number;
  totalDays: number;
  completionPercentage: number;
  longestStreak: number;
  status: string;
  tasksCompletedByCategory: {
    diet: number;
    workout1: number;
    workout2: number;
    water: number;
    reading: number;
    photo: number;
  };
  dailyLogs: any[];
}

export class ChallengeService {
  /**
   * Create a new 75 Hard challenge for a user
   */
  async createChallenge(data: CreateChallengeData) {
    // Check if user already has an active challenge
    const existingActiveChallenge = await prisma.challenge.findFirst({
      where: {
        userId: data.userId,
        status: 'active',
      },
    });

    if (existingActiveChallenge) {
      throw new ConflictError('User already has an active challenge');
    }

    const challenge = await prisma.challenge.create({
      data: {
        userId: data.userId,
        startDate: data.startDate || new Date(),
        currentDay: 0,
        status: 'active',
      },
    });

    return challenge;
  }

  /**
   * Get challenge details by ID
   */
  async getChallengeById(challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
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

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    return challenge;
  }

  /**
   * Submit or update daily tasks for a specific date
   */
  async submitDailyLog(
    challengeId: string,
    date: Date,
    tasks: DailyTasksData
  ) {
    // Get the challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        dailyLogs: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    if (challenge.status !== 'active') {
      throw new ValidationError('Challenge is not active');
    }

    // Validate date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    if (logDate > today) {
      throw new ValidationError('Cannot log tasks for future dates');
    }

    // Validate date is not before challenge start date
    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (logDate < startDate) {
      throw new ValidationError('Cannot log tasks before challenge start date');
    }

    // Prepare timestamp data for tasks that are marked as complete
    const now = new Date();
    const taskTimestamps: any = {};
    if (tasks.diet) taskTimestamps.dietTime = now;
    if (tasks.workout1) taskTimestamps.workout1Time = now;
    if (tasks.workout2) taskTimestamps.workout2Time = now;
    if (tasks.water) taskTimestamps.waterTime = now;
    if (tasks.reading) taskTimestamps.readingTime = now;
    if (tasks.photo) taskTimestamps.photoTime = now;

    // Check if all tasks are completed
    const allTasksCompleted =
      tasks.diet &&
      tasks.workout1 &&
      tasks.workout2 &&
      tasks.water &&
      tasks.reading &&
      tasks.photo;

    // Upsert the daily log
    const dailyLog = await prisma.dailyLog.upsert({
      where: {
        challengeId_date: {
          challengeId,
          date: logDate,
        },
      },
      update: {
        ...tasks,
        ...taskTimestamps,
        completedAt: allTasksCompleted ? now : null,
      },
      create: {
        challengeId,
        date: logDate,
        ...tasks,
        ...taskTimestamps,
        completedAt: allTasksCompleted ? now : null,
      },
    });

    // Update challenge progress
    await this.updateChallengeProgress(challengeId);

    return dailyLog;
  }

  /**
   * Update challenge progress (current day, status, streak)
   */
  async updateChallengeProgress(challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        dailyLogs: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Calculate current day based on completed days
    let consecutiveDays = 0;
    let lastCompletedDate: Date | null = null;

    for (const log of challenge.dailyLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      // Check if all tasks are completed for this day
      const allTasksCompleted =
        log.diet &&
        log.workout1 &&
        log.workout2 &&
        log.water &&
        log.reading &&
        log.photo;

      if (allTasksCompleted) {
        // Check if this is consecutive with the last completed date
        if (lastCompletedDate === null) {
          consecutiveDays = 1;
        } else {
          const daysDiff = Math.floor(
            (logDate.getTime() - lastCompletedDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            consecutiveDays++;
          } else if (daysDiff > 1) {
            // Streak broken, reset
            consecutiveDays = 1;
          }
        }

        lastCompletedDate = logDate;
      } else {
        // If a day was started but not completed and it's in the past, streak is broken
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (logDate < today && lastCompletedDate !== null) {
          // Streak broken
          consecutiveDays = 0;
          lastCompletedDate = null;
        }
      }
    }

    // Determine challenge status
    let status = challenge.status;
    if (consecutiveDays >= 75) {
      status = 'completed';
    } else if (challenge.status === 'active') {
      // Check if streak was broken (there's a gap in consecutive days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastCompletedDate) {
        const daysSinceLastCompleted = Math.floor(
          (today.getTime() - lastCompletedDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        // If more than 1 day has passed since last completion, challenge failed
        if (daysSinceLastCompleted > 1) {
          status = 'failed';
          consecutiveDays = 0;
        }
      } else {
        // If no days completed and more than 1 day has passed since start
        const daysSinceStart = Math.floor(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceStart > 1) {
          status = 'failed';
        }
      }
    }

    // Update the challenge
    const updatedChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        currentDay: consecutiveDays,
        status,
      },
    });

    return updatedChallenge;
  }

  /**
   * Get progress statistics for a challenge
   */
  async getProgress(challengeId: string): Promise<ProgressStats> {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        dailyLogs: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    // Calculate task completion counts
    const tasksCompletedByCategory = {
      diet: 0,
      workout1: 0,
      workout2: 0,
      water: 0,
      reading: 0,
      photo: 0,
    };

    let longestStreak = 0;
    let currentStreak = 0;
    let lastCompletedDate: Date | null = null;

    for (const log of challenge.dailyLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      // Count completed tasks
      if (log.diet) tasksCompletedByCategory.diet++;
      if (log.workout1) tasksCompletedByCategory.workout1++;
      if (log.workout2) tasksCompletedByCategory.workout2++;
      if (log.water) tasksCompletedByCategory.water++;
      if (log.reading) tasksCompletedByCategory.reading++;
      if (log.photo) tasksCompletedByCategory.photo++;

      // Calculate longest streak
      const allTasksCompleted =
        log.diet &&
        log.workout1 &&
        log.workout2 &&
        log.water &&
        log.reading &&
        log.photo;

      if (allTasksCompleted) {
        if (lastCompletedDate === null) {
          currentStreak = 1;
        } else {
          const daysDiff = Math.floor(
            (logDate.getTime() - lastCompletedDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        }

        longestStreak = Math.max(longestStreak, currentStreak);
        lastCompletedDate = logDate;
      }
    }

    const completionPercentage = (challenge.currentDay / 75) * 100;

    return {
      currentDay: challenge.currentDay,
      totalDays: 75,
      completionPercentage: Math.min(completionPercentage, 100),
      longestStreak,
      status: challenge.status,
      tasksCompletedByCategory,
      dailyLogs: challenge.dailyLogs,
    };
  }

  /**
   * Delete a challenge
   */
  async deleteChallenge(challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    await prisma.challenge.delete({
      where: { id: challengeId },
    });

    return { message: 'Challenge deleted successfully' };
  }

  /**
   * Get daily log for a specific date
   */
  async getDailyLog(challengeId: string, date: Date) {
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        challengeId_date: {
          challengeId,
          date: logDate,
        },
      },
    });

    return dailyLog;
  }

  /**
   * Get today's daily log
   */
  async getTodayLog(challengeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.getDailyLog(challengeId, today);
  }
}

export default new ChallengeService();
