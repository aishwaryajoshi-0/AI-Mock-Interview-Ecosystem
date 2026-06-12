import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import { sendLoginOtpEmail, sendRegisterOtpEmail } from '../services/emailService.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { generateToken } from '../utils/generateToken.js';

const loginOtpStore = new Map();
const registerOtpStore = new Map();
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  resumeUrl: user.resumeUrl,
});

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return apiError(res, 'Email already registered', 400);
    }

    const otp = createOtp();
    const hashedPassword = await bcrypt.hash(password, 12);
    const otpHash = await bcrypt.hash(otp, 10);

    registerOtpStore.set(normalizedEmail, {
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      otpHash,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    });

    await sendRegisterOtpEmail({ to: normalizedEmail, name: normalizedName, otp });

    return apiSuccess(res, { email: normalizedEmail }, 'OTP sent to your email', 202);
  } catch (error) {
    next(error);
  }
};

export const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = registerOtpStore.get(normalizedEmail);

    if (!otpRecord) {
      return apiError(res, 'OTP expired or not requested', 400);
    }

    if (otpRecord.expiresAt < Date.now()) {
      registerOtpStore.delete(normalizedEmail);
      return apiError(res, 'OTP expired. Please create your account again', 400);
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValidOtp) {
      return apiError(res, 'Invalid OTP', 401);
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      registerOtpStore.delete(normalizedEmail);
      return apiError(res, 'Email already registered', 400);
    }

    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
    });

    registerOtpStore.delete(normalizedEmail);

    const token = generateToken({ id: user._id });
    return apiSuccess(res, { user: getSafeUser(user), token }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return apiError(res, 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiError(res, 'Invalid email or password', 401);
    }

    const otp = createOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    loginOtpStore.set(user._id.toString(), {
      otpHash,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    });

    await sendLoginOtpEmail({ to: user.email, name: user.name, otp });

    return apiSuccess(res, { userId: user._id, email: user.email }, 'OTP sent to your email');
  } catch (error) {
    next(error);
  }
};

export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const otpRecord = loginOtpStore.get(userId);

    if (!otpRecord) {
      return apiError(res, 'OTP expired or not requested', 400);
    }

    if (otpRecord.expiresAt < Date.now()) {
      loginOtpStore.delete(userId);
      return apiError(res, 'OTP expired. Please sign in again', 400);
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValidOtp) {
      return apiError(res, 'Invalid OTP', 401);
    }

    loginOtpStore.delete(userId);

    const user = await User.findById(userId);
    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    const token = generateToken({ id: user._id });
    return apiSuccess(res, { user: getSafeUser(user), token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return apiSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    return apiSuccess(res, user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    return apiSuccess(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiError(res, 'Avatar file is required', 400);
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, 'avatars');
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { avatar: uploadResult.secure_url }, { new: true }).select('-password');

    return apiSuccess(res, updatedUser, 'Avatar uploaded successfully');
  } catch (error) {
    next(error);
  }
};
