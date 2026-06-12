// MODIFIED
import { Sequelize } from 'sequelize';
import { env } from './env.js';

/**
 * Sequelize instance for PostgreSQL connection.
 */
const sequelize = new Sequelize(env.PG_DATABASE, env.PG_USER, env.PG_PASSWORD, {
  host: env.PG_HOST,
  port: env.PG_PORT,
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Tests PostgreSQL connectivity and syncs Sequelize models in development only.
 * @returns {Promise<boolean>} Whether the PostgreSQL connection is available.
 */
const testPostgresConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    // NEW: PostgreSQL setup
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('PostgreSQL models synchronized');
    }

    return true;
  } catch (error) {
    const reason =
      error?.parent?.message ||
      error?.original?.message ||
      error?.message ||
      error?.name ||
      String(error);
    console.error(`PostgreSQL connection failed: ${reason}`);
    return false;
  }
};

export { sequelize, testPostgresConnection };
