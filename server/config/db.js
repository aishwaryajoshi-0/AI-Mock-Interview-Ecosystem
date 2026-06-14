import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

export const connectDatabase = async () => {
  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  };

  if (env.MONGO_URI) {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(env.MONGO_URI, connectOptions);
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.warn('MongoDB connection failed, falling back to in-memory server:', error.message);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MongoDB connection failed and no fallback is available in production');
  }

  if (process.env.USE_MEMORY_MONGO !== 'true') {
    throw new Error('MongoDB connection failed. Check MONGO_URI in server/.env, or set USE_MEMORY_MONGO=true for local fallback.');
  }

  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), connectOptions);
  console.log('Connected to in-memory MongoDB for development');
};
