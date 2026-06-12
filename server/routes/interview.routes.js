// MODIFIED
import express from 'express';
import {
  startSession,
  submitAnswer,
  endSession,
  getFollowUp,
  getSessionById,
  getAllSessions,
} from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { interviewLimiter } from '../middleware/rateLimiter.js';
import { startSessionValidator, submitAnswerValidator } from '../validators/interviewValidator.js';

const router = express.Router();

router.post('/start', authMiddleware, interviewLimiter, startSessionValidator, validate, startSession);
router.post('/submit-answer', authMiddleware, interviewLimiter, submitAnswerValidator, validate, submitAnswer);
router.post('/end', authMiddleware, interviewLimiter, endSession);
// NEW: Adaptive Difficulty + Follow-Up Question Engine
router.post('/follow-up', authMiddleware, getFollowUp);
router.get('/all', authMiddleware, getAllSessions);
router.get('/:id', authMiddleware, getSessionById);

export default router;
