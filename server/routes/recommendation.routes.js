import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as recommendationController from '../controllers/recommendationController.js';

const router = express.Router();

/**
 * GET /api/recommendations/:userId - Get latest recommendations
 */
router.get('/:userId', authMiddleware, recommendationController.getLatestRecommendations);

/**
 * GET /api/recommendations/:userId/history - Get recommendation history
 */
router.get('/:userId/history', authMiddleware, recommendationController.getHistory);

/**
 * PATCH /api/recommendations/:recId/resource/:idx - Mark resource as completed
 */
router.patch(
  '/:recId/resource/:idx',
  authMiddleware,
  recommendationController.markResourceComplete
);

/**
 * PATCH /api/recommendations/:recId/plan/:day - Mark plan task as completed
 */
router.patch(
  '/:recId/plan/:day',
  authMiddleware,
  recommendationController.markPlanTaskComplete
);

export default router;
