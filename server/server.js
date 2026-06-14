// MODIFIED
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { testPostgresConnection } from './config/postgres.js';
import { env, testRedisConnection } from './config/env.js';
import { testCloudinaryConnection } from './config/cloudinary.js';
import { initializeRedis } from './utils/redisClient.js';

const startServer = async () => {
  try {
    initializeRedis();

    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });

    Promise.allSettled([
      testCloudinaryConnection(),
      testRedisConnection(),
      testPostgresConnection(),
    ]).then((results) => {
      const [cloudinaryResult, redisResult, postgresResult] = results;

      if (cloudinaryResult.status === 'rejected') {
        console.warn(`Cloudinary health check failed: ${cloudinaryResult.reason?.message || cloudinaryResult.reason}`);
      }

      if (redisResult.status === 'rejected') {
        console.warn(`Redis health check failed: ${redisResult.reason?.message || redisResult.reason}`);
      }

      if (postgresResult.status === 'rejected' || postgresResult.value === false) {
        console.warn('Server running without PostgreSQL connection');
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${env.PORT} is already in use. Stop the existing server or set PORT to another value.`);
        return;
      }

      console.error('Server failed:', error);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
