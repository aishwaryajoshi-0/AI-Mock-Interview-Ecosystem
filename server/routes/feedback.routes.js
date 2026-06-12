import express from 'express';
import { generateFeedback, getFeedbackBySession, getFeedbackById } from '../controllers/feedbackController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateFeedback);
router.get('/session/:sessionId', authMiddleware, getFeedbackBySession);
router.get('/:id', authMiddleware, getFeedbackById);

export default router;
