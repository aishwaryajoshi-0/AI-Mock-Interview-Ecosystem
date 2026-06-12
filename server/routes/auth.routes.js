import express from 'express';
import { register, verifyRegisterOtp, login, verifyLoginOtp, logout, getProfile, updateProfile, uploadAvatar } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { registerValidator, verifyRegisterOtpValidator, loginValidator, verifyLoginOtpValidator } from '../validators/authValidator.js';
import { uploadAvatar as avatarUpload, uploadErrorHandler } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/verify-register-otp', verifyRegisterOtpValidator, validate, verifyRegisterOtp);
router.post('/login', loginValidator, validate, login);
router.post('/verify-login-otp', verifyLoginOtpValidator, validate, verifyLoginOtp);
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/upload-avatar', authMiddleware, avatarUpload, uploadErrorHandler, uploadAvatar);

export default router;
