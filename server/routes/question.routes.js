import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  getQuestionsByDomain,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllQuestions);
router.get('/domain/:domain', authMiddleware, getQuestionsByDomain);
router.get('/:id', authMiddleware, getQuestionById);
router.post('/', authMiddleware, createQuestion);
router.put('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

export default router;
