import User from '../models/User.js';
import { sendLoginOtpEmail, sendRegisterOtpEmail } from '../services/emailService.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { generateToken } from '../utils/generateToken.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { setOTP, getOTP, deleteOTP } from '../utils/redisClient.js';
import cloudinary from '../config/cloudinary.js';

const OTP_TTL_SECONDS = 300; // 5 minutes
const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  resumeUrl: user.resumeUrl,
  isVerified: user.isVerified,
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

/**
 * Register Step 1: Send OTP to email
 * Generates OTP and stores name, email, password in Redis temporarily
 */
export const registerSendOTP = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return apiError(res, 'Email already registered', 400);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store in Redis: name, email, password (raw - will be hashed by User model pre-save hook)
    await setOTP('register', normalizedEmail, {
      name: normalizedName,
      email: normalizedEmail,
      password,
      otp,
    }, OTP_TTL_SECONDS);

    // Send OTP email
    await sendRegisterOtpEmail({
      to: normalizedEmail,
      name: normalizedName,
      otp,
    });

    return apiSuccess(res, { email: normalizedEmail }, 'OTP sent to your email', 202);
  } catch (error) {
    next(error);
  }
};

/**
 * Register Step 2: Verify OTP and create user
 */
export const registerVerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Get stored OTP data from Redis
    const otpRecord = await getOTP('register', normalizedEmail);

    if (!otpRecord) {
      return apiError(res, 'OTP expired or not requested. Please create your account again.', 400);
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return apiError(res, 'Incorrect OTP. Please try again.', 401);
    }

    // Check if user was created by another request
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await deleteOTP('register', normalizedEmail);
      return apiError(res, 'Email already registered', 400);
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      isVerified: true,
    });

    // Delete OTP from Redis
    await deleteOTP('register', normalizedEmail);

    // Generate JWT token
    const token = generateToken({ id: user._id });

    return apiSuccess(
      res,
      { user: getSafeUser(user), token },
      'Account created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login Step 1: Verify credentials and send OTP
 */
export const loginSendOTP = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return apiError(res, 'Invalid email or password', 401);
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return apiError(res, 'Invalid email or password', 401);
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in Redis (just the OTP, user is identified by email)
    await setOTP('login', normalizedEmail, {
      otp,
      userId: user._id.toString(),
    }, OTP_TTL_SECONDS);

    // Send OTP email
    await sendLoginOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    return apiSuccess(
      res,
      { email: normalizedEmail, userId: user._id },
      'OTP sent to your email',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login Step 2: Verify OTP and return JWT
 */
export const loginVerifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Get OTP record from Redis
    const otpRecord = await getOTP('login', normalizedEmail);

    if (!otpRecord) {
      return apiError(res, 'OTP expired or not requested. Please sign in again.', 400);
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return apiError(res, 'Incorrect OTP. Please try again.', 401);
    }

    // Get user
    const user = await User.findById(otpRecord.userId);
    if (!user) {
      await deleteOTP('login', normalizedEmail);
      return apiError(res, 'User not found', 404);
    }

    // Delete OTP from Redis
    await deleteOTP('login', normalizedEmail);

    // Generate JWT token
    const token = generateToken({ id: user._id });

    return apiSuccess(
      res,
      { user: getSafeUser(user), token },
      'Login successful',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP for both register and login flows
 */
export const resendOTP = async (req, res, next) => {
  try {
    const { email, type } = req.body; // type: 'register' or 'login'
    const normalizedEmail = email.toLowerCase().trim();

    if (!['register', 'login'].includes(type)) {
      return apiError(res, 'Invalid type. Must be "register" or "login".', 400);
    }

    // Get existing OTP record
    const otpRecord = await getOTP(type, normalizedEmail);
    if (!otpRecord) {
      return apiError(
        res,
        `No ${type} request found. Please start the ${type} process again.`,
        400
      );
    }

    // Generate new OTP
    const newOtp = generateOTP();

    // Update Redis with new OTP
    const newRecord = { ...otpRecord, otp: newOtp };
    await setOTP(type, normalizedEmail, newRecord, OTP_TTL_SECONDS);

    // Send OTP email based on type
    if (type === 'register') {
      await sendRegisterOtpEmail({
        to: normalizedEmail,
        name: otpRecord.name || 'there',
        otp: newOtp,
      });
    } else {
      const user = await User.findById(otpRecord.userId);
      await sendLoginOtpEmail({
        to: normalizedEmail,
        name: user?.name || 'there',
        otp: newOtp,
      });
    }

    return apiSuccess(res, { email: normalizedEmail }, 'OTP resent to your email', 200);
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
