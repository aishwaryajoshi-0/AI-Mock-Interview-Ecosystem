import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit OTP string
 */
export const generateOTP = () => {
  const otp = crypto.randomInt(0, 1000000);
  return String(otp).padStart(6, '0');
};
