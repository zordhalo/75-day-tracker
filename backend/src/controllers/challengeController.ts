import { Request, Response, NextFunction } from 'express';
import challengeService from '../services/challengeService';

export class ChallengeController {
  /**
   * POST /api/challenges - Create a new challenge
   */
  async createChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, startDate } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const challenge = await challengeService.createChallenge({
        userId,
        startDate: startDate ? new Date(startDate) : undefined,
      });

      res.status(201).json(challenge);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/challenges/:id - Get challenge details
   */
  async getChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const challenge = await challengeService.getChallengeById(id);
      res.json(challenge);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/challenges/:id/daily-log - Submit daily tasks
   */
  async submitDailyLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { date, ...tasks } = req.body;

      const logDate = date ? new Date(date) : new Date();

      const dailyLog = await challengeService.submitDailyLog(
        id,
        logDate,
        tasks
      );

      res.status(201).json(dailyLog);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/challenges/:id/daily-log/:date - Update daily log for specific date
   */
  async updateDailyLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, date } = req.params;
      const tasks = req.body;

      const logDate = new Date(date);

      const dailyLog = await challengeService.submitDailyLog(
        id,
        logDate,
        tasks
      );

      res.json(dailyLog);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/challenges/:id/progress - Get progress statistics
   */
  async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const progress = await challengeService.getProgress(id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/challenges/:id - Delete challenge
   */
  async deleteChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await challengeService.deleteChallenge(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/challenges/:id/daily-log/today - Get today's log
   */
  async getTodayLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const log = await challengeService.getTodayLog(id);
      res.json(log || { message: 'No log for today yet' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/challenges/:id/daily-log/:date - Get daily log for specific date
   */
  async getDailyLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, date } = req.params;
      const logDate = new Date(date);
      const log = await challengeService.getDailyLog(id, logDate);
      res.json(log || { message: 'No log for this date' });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChallengeController();
