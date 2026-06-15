// MODIFIED
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/postgres.js';

/**
 * SkillProfile Model - Stores user's skill scores across 7 technical domains
 * Tracks overall level: beginner, intermediate, advanced
 */
const SkillProfile = sequelize.define(
  'SkillProfile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Stores MongoDB _id as string for cross-database reference',
    },
    dbms_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Database Management Systems score (0-100)',
    },
    oops_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Object-Oriented Programming score (0-100)',
    },
    os_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Operating Systems score (0-100)',
    },
    cn_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Computer Networks score (0-100)',
    },
    dsa_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Data Structures & Algorithms score (0-100)',
    },
    hr_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Human Resources & Behavioral score (0-100)',
    },
    aptitude_score: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
      comment: 'Quantitative Aptitude score (0-100)',
    },
    session_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of completed sessions',
    },
    overall_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
      comment: 'Overall proficiency level based on average score',
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'skill_profiles',
    timestamps: true,
    indexes: [
      { fields: ['user_id'], unique: true }
    ],
  }
);

export default SkillProfile;
