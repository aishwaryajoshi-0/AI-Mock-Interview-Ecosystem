import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { completeOnboarding, getProfile, updateProfile } from '../controllers/profileController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All profile routes require authentication
router.use(authenticate);

/**
 * POST /api/profile/onboarding
 * Complete user onboarding via resume upload or skill form
 */
router.post('/onboarding', upload.single('resume'), completeOnboarding);

/**
 * GET /api/profile/me
 * Get current user profile
 */
router.get('/me', getProfile);

/**
 * PUT /api/profile/me
 * Update user profile
 */
router.put('/me', updateProfile);

export default router;
