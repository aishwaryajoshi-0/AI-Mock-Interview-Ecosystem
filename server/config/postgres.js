// MODIFIED
import { Sequelize } from 'sequelize';
import { env } from './env.js';

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);

/**
 * Sequelize instance for PostgreSQL connection.
 */
const sequelizeOptions = {
  logging: env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000,
  },
};

if (env.POSTGRES_URI?.includes('sslmode=require')) {
  sequelizeOptions.dialectOptions = {
    connectionTimeoutMillis: 10000,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = env.POSTGRES_URI
  ? new Sequelize(env.POSTGRES_URI, {
      dialect: 'postgres',
      ...sequelizeOptions,
    })
  : new Sequelize(env.PG_DATABASE, env.PG_USER, env.PG_PASSWORD, {
      host: env.PG_HOST,
      port: env.PG_PORT,
      dialect: 'postgres',
      ...sequelizeOptions,
    });

/**
 * Tests PostgreSQL connectivity and syncs Sequelize models in development only.
 * @returns {Promise<boolean>} Whether the PostgreSQL connection is available.
 */
const testPostgresConnection = async () => {
  try {
    await withTimeout(sequelize.authenticate(), 10000, 'PostgreSQL connection');
    console.log('PostgreSQL connected');

    // NEW: PostgreSQL setup
    if (env.NODE_ENV === 'development') {
      await withTimeout(sequelize.sync({ alter: true }), 30000, 'PostgreSQL model sync');
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
