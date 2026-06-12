import express from 'express';
import { getAllUsers, getUserById, deleteUser, getStats, getDashboardData } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.get('/dashboard', getDashboardData);

export default router;
