import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const testCloudinaryConnection = async () => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary not configured; add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    return false;
  }

  try {
    await cloudinary.api.ping();
    console.log('Cloudinary connected');
    return true;
  } catch (error) {
    console.warn(`Cloudinary connection failed: ${error.message}`);
    return false;
  }
};

export default cloudinary;
