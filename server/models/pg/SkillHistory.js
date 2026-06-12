// MODIFIED
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/postgres.js';
import SkillProfile from './SkillProfile.js';

/**
 * SkillHistory Model - Stores historical skill score updates
 * Enables trend analysis and progress tracking
 */
const SkillHistory = sequelize.define(
  'SkillHistory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Reference to user_id in SkillProfile',
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Topic name (DBMS, OOPS, OS, CN, DSA, HR, Aptitude)',
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    session_id: {
      type: DataTypes.STRING,
      comment: 'Reference to MongoDB Session._id',
    },
    recorded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'skill_history',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['user_id', 'topic'] },
      { fields: ['recorded_at'] },
    ],
  }
);

// NEW: Define foreign key relationship
SkillHistory.belongsTo(SkillProfile, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  constraints: true,
});

export default SkillHistory;
