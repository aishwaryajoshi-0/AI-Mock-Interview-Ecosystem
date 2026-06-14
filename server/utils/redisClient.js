import { env, redisClient } from '../config/env.js';

const memoryOtpStore = new Map();

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);

export const initializeRedis = () => {
  if (!env.REDIS_ENABLED) {
    console.log('Redis is disabled');
    return null;
  }

  return redisClient;
};

export const getRedisClient = () => redisClient;

const getReadyRedisClient = async () => {
  const client = getRedisClient();
  if (!client) {
    throw new Error('Redis is not available. Check REDIS_ENABLED and Redis connection settings.');
  }

  if (client.status === 'wait') {
    await withTimeout(client.connect(), 10000, 'Redis connection');
  }

  return client;
};

const getOtpKey = (type, email) => `otp:${type}:${email.toLowerCase()}`;

const setMemoryOTP = (key, data, ttl) => {
  const expiresAt = Date.now() + ttl * 1000;
  memoryOtpStore.set(key, { data, expiresAt });
};

const getMemoryOTP = (key) => {
  const record = memoryOtpStore.get(key);
  if (!record) return null;

  if (record.expiresAt <= Date.now()) {
    memoryOtpStore.delete(key);
    return null;
  }

  return record.data;
};

const shouldUseMemoryFallback = () => env.NODE_ENV !== 'production';

export const setOTP = async (type, email, data, ttl = 300) => {
  const key = getOtpKey(type, email);

  try {
    const client = await getReadyRedisClient();
    await client.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting OTP in Redis:', error);
    if (shouldUseMemoryFallback()) {
      console.warn('Using in-memory OTP fallback for development');
      setMemoryOTP(key, data, ttl);
      return true;
    }
    throw error;
  }
};

export const getOTP = async (type, email) => {
  const key = getOtpKey(type, email);

  try {
    const client = await getReadyRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting OTP from Redis:', error);
    if (shouldUseMemoryFallback()) {
      console.warn('Reading OTP from in-memory fallback for development');
      return getMemoryOTP(key);
    }
    throw error;
  }
};

export const deleteOTP = async (type, email) => {
  const key = getOtpKey(type, email);

  try {
    const client = await getReadyRedisClient();
    await client.del(key);
    memoryOtpStore.delete(key);
    return true;
  } catch (error) {
    console.error('Error deleting OTP from Redis:', error);
    if (shouldUseMemoryFallback()) {
      memoryOtpStore.delete(key);
      return true;
    }
    throw error;
  }
};
