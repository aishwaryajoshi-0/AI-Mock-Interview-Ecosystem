import express from 'express';
import {
  registerSendOTP,
  registerVerifyOTP,
  loginSendOTP,
  loginVerifyOTP,
  resendOTP,
  logout,
  getProfile,
  updateProfile,
  uploadAvatar,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { registerValidator, verifyRegisterOtpValidator, loginValidator, verifyLoginOtpValidator } from '../validators/authValidator.js';
import { uploadAvatar as avatarUpload, uploadErrorHandler } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// OTP Routes
router.post('/register/send-otp', registerValidator, validate, registerSendOTP);
router.post('/register/verify-otp', verifyRegisterOtpValidator, validate, registerVerifyOTP);
router.post('/login/send-otp', loginValidator, validate, loginSendOTP);
router.post('/login/verify-otp', verifyLoginOtpValidator, validate, loginVerifyOTP);
router.post('/resend-otp', resendOTP);

// Protected Routes
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/upload-avatar', authMiddleware, avatarUpload, uploadErrorHandler, uploadAvatar);

export default router;
