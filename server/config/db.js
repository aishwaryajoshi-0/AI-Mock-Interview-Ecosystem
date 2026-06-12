import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

export const connectDatabase = async () => {
  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (env.MONGO_URI) {
    try {
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

  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), connectOptions);
  console.log('Connected to in-memory MongoDB for development');
};
