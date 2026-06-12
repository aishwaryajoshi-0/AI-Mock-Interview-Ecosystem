// MODIFIED
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { testPostgresConnection } from './config/postgres.js';
import { env, testRedisConnection } from './config/env.js';
import { testCloudinaryConnection } from './config/cloudinary.js';

const startServer = async () => {
  try {
    // NEW: PostgreSQL setup
    await connectDatabase();
    await testCloudinaryConnection();
    await testRedisConnection();
    const pgConnected = await testPostgresConnection();

    if (!pgConnected) {
      console.warn('Server starting without PostgreSQL connection');
    }

    const server = app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
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
