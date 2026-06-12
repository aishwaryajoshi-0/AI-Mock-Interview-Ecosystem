import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as skillProfileController from '../controllers/skillProfileController.js';

const router = express.Router();

/**
 * GET /api/skill-profile/:userId - Get user's skill profile
 */
router.get('/:userId', authMiddleware, skillProfileController.getProfile);

/**
 * GET /api/skill-profile/:userId/weakest - Get weakest topics
 */
router.get('/:userId/weakest', authMiddleware, skillProfileController.getWeakest);

/**
 * GET /api/skill-profile/:userId/history/:topic - Get skill history for topic
 */
router.get(
  '/:userId/history/:topic',
  authMiddleware,
  skillProfileController.getHistory
);

export default router;
