import Redis from 'ioredis';
import { env } from '../config/env.js';

let redisClient = null;

/**
 * Initialize Redis client
 * @returns {Redis|null} Redis instance or null if disabled
 */
export const initializeRedis = () => {
  if (!env.REDIS_ENABLED) {
    console.log('Redis is disabled');
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    if (env.REDIS_URL) {
      redisClient = new Redis(env.REDIS_URL);
    } else {
      redisClient = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });
    }

    redisClient.on('connect', () => {
      console.log('Redis connected');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null;
  }
};

/**
 * Get Redis client instance
 * @returns {Redis|null}
 */
export const getRedisClient = () => {
  if (!redisClient && env.REDIS_ENABLED) {
    initializeRedis();
  }
  return redisClient;
};

/**
 * Store OTP in Redis with TTL
 * @param {string} type - 'register' or 'login'
 * @param {string} email - User email
 * @param {object} data - Data to store
 * @param {number} ttl - Time to live in seconds (default 300 = 5 minutes)
 */
export const setOTP = async (type, email, data, ttl = 300) => {
  const client = getRedisClient();
  if (!client) {
    throw new Error('Redis is not available');
  }

  const key = `otp:${type}:${email.toLowerCase()}`;
  const jsonData = JSON.stringify(data);

  try {
    await client.setex(key, ttl, jsonData);
    return true;
  } catch (error) {
    console.error('Error setting OTP in Redis:', error);
    throw error;
  }
};

/**
 * Get OTP data from Redis
 * @param {string} type - 'register' or 'login'
 * @param {string} email - User email
 * @returns {object|null}
 */
export const getOTP = async (type, email) => {
  const client = getRedisClient();
  if (!client) {
    throw new Error('Redis is not available');
  }

  const key = `otp:${type}:${email.toLowerCase()}`;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting OTP from Redis:', error);
    throw error;
  }
};

/**
 * Delete OTP from Redis
 * @param {string} type - 'register' or 'login'
 * @param {string} email - User email
 */
export const deleteOTP = async (type, email) => {
  const client = getRedisClient();
  if (!client) {
    throw new Error('Redis is not available');
  }

  const key = `otp:${type}:${email.toLowerCase()}`;

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting OTP from Redis:', error);
    throw error;
  }
};
