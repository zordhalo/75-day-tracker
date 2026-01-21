import { Router } from 'express';
import challengeController from '../controllers/challengeController';

const router = Router();

// Challenge routes
router.post('/', challengeController.createChallenge.bind(challengeController));
router.get('/:id', challengeController.getChallenge.bind(challengeController));
router.delete('/:id', challengeController.deleteChallenge.bind(challengeController));

// Daily log routes
router.post('/:id/daily-log', challengeController.submitDailyLog.bind(challengeController));
router.put('/:id/daily-log/:date', challengeController.updateDailyLog.bind(challengeController));
router.get('/:id/daily-log/today', challengeController.getTodayLog.bind(challengeController));
router.get('/:id/daily-log/:date', challengeController.getDailyLog.bind(challengeController));

// Progress routes
router.get('/:id/progress', challengeController.getProgress.bind(challengeController));

export default router;
