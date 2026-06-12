import multer from 'multer';
import path from 'path';
import { apiError } from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Unsupported file type'), false);
  }
  cb(null, true);
};

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single('avatar');

export const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).single('resume');

export const uploadErrorHandler = (err, req, res, next) => {
  if (err) {
    return apiError(res, err.message || 'Upload failed', 400);
  }
  next();
};
