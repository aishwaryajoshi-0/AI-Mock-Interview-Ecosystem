// MODIFIED
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/postgres.js';

/**
 * CompanyProfile Model - Stores interview patterns and difficulty distributions
 * for different companies and roles
 */
const CompanyProfile = sequelize.define(
  'CompanyProfile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interview_pattern: {
      type: DataTypes.TEXT,
      comment: 'Description of typical interview structure',
    },
    difficulty_easy: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
      validate: { min: 0, max: 100 },
      comment: 'Percentage of easy difficulty questions (0-100)',
    },
    difficulty_medium: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0, max: 100 },
      comment: 'Percentage of medium difficulty questions (0-100)',
    },
    difficulty_hard: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      validate: { min: 0, max: 100 },
      comment: 'Percentage of hard difficulty questions (0-100)',
    },
    favorite_topics: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Most commonly asked topic areas',
    },
    behavioral_weight: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0, max: 100 },
      comment: 'Percentage weight for behavioral questions',
    },
    technical_weight: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      validate: { min: 0, max: 100 },
      comment: 'Percentage weight for technical questions',
    },
    special_notes: {
      type: DataTypes.TEXT,
      comment: 'Additional notes about interview process',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'company_profiles',
    timestamps: true,
    indexes: [
      { fields: ['company'] },
      { fields: ['company', 'role'], unique: true },
      { fields: ['is_active'] },
    ],
  }
);

export default CompanyProfile;
