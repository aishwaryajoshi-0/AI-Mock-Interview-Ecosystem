// MODIFIED
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiError } from '../utils/apiResponse.js';
import * as memoryController from '../controllers/memoryController.js';

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return apiError(res, 'Admin access required', 403);
  }
  return next();
};

router.get('/:userId', authMiddleware, memoryController.getMemory);
// NEW: Interview Memory System
router.delete('/:userId/reset', authMiddleware, adminOnly, memoryController.resetMemory);

export default router;
