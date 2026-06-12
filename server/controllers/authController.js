import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { generateToken } from '../utils/generateToken.js';

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiError(res, 'Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken({ id: user._id });

    return apiSuccess(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, resumeUrl: user.resumeUrl }, token }, 'Registration successful', 201);
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

    const token = generateToken({ id: user._id });
    return apiSuccess(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, resumeUrl: user.resumeUrl }, token }, 'Login successful');
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
