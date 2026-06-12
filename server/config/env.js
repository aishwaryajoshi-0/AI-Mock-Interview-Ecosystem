import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config({ path: '.env' });

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  REDIS_ENABLED: process.env.REDIS_ENABLED === 'true',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  AI_ENGINE_URL: process.env.AI_ENGINE_URL,
  LLM_API_KEY: process.env.LLM_API_KEY,
  // NEW: PostgreSQL Configuration
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: process.env.PG_PORT || 5432,
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DATABASE: process.env.PG_DATABASE || 'interview_platform',
  // NEW: OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const createRedisClient = () => {
  if (!env.REDIS_ENABLED || !env.REDIS_HOST || !env.REDIS_PORT) {
    return null;
  }

  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      return times <= 3 ? Math.min(times * 250, 1000) : null;
    },
  });

  client.on('error', (err) => {
    console.warn(`Redis unavailable: ${err.message}`);
  });

  client.on('ready', () => {
    console.log('Redis connected');
  });

  client.connect().catch((err) => {
    console.warn(`Redis disabled for this run: ${err.message}`);
  });

  return client;
};

const redisClient = createRedisClient();

export { env, redisClient };
