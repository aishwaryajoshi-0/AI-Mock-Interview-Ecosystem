import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getProgressOverview, getSessionFeedback } from '../controllers/progressController.js';

const router = express.Router();

// All progress routes require authentication
router.use(authenticate);

/**
 * GET /api/progress/overview
 * Get progress overview for the current user
 */
router.get('/overview', getProgressOverview);

/**
 * GET /api/progress/session/:sessionId
 * Get detailed feedback for a specific session
 */
router.get('/session/:sessionId', getSessionFeedback);

export default router;
