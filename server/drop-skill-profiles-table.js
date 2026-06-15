import { sequelize } from './config/postgres.js';

const dropTable = async () => {
  try {
    await sequelize.query('DROP TABLE IF EXISTS skill_profiles CASCADE');
    console.log('skill_profiles table dropped successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping table:', error);
    process.exit(1);
  }
};

dropTable();
