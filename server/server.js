// MODIFIED
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { testPostgresConnection } from './config/postgres.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    // NEW: PostgreSQL setup
    await connectDatabase();
    const pgConnected = await testPostgresConnection();

    if (!pgConnected) {
      console.warn('Server starting without PostgreSQL connection');
    }

    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
