// MODIFIED
import CompanyProfile from '../models/pg/CompanyProfile.js';

/**
 * Get all active companies
 * @returns {Promise<Array>} Array of unique company names
 */
const getAllCompanies = async () => {
  try {
    const companies = await CompanyProfile.findAll({
      where: { is_active: true },
      attributes: ['company'],
      raw: true,
      group: ['company'],
      subQuery: false,
    });
    
    return companies.map((c) => c.company);
  } catch (error) {
    console.error('Error in getAllCompanies:', error);
    throw error;
  }
};

/**
 * Get all roles for a company
 * @param {string} company - Company name
 * @returns {Promise<Array>} Array of role names
 */
const getRolesForCompany = async (company) => {
  try {
    const roles = await CompanyProfile.findAll({
      where: { company, is_active: true },
      attributes: ['role'],
      raw: true,
    });
    
    return roles.map((r) => r.role);
  } catch (error) {
    console.error('Error in getRolesForCompany:', error);
    throw error;
  }
};

/**
 * Get complete company profile for a specific role
 * @param {string} company - Company name
 * @param {string} role - Role name
 * @returns {Promise<Object>} Company profile
 */
const getCompanyProfile = async (company, role) => {
  try {
    const profile = await CompanyProfile.findOne({
      where: { company, role, is_active: true },
      raw: true,
    });
    
    return profile;
  } catch (error) {
    console.error('Error in getCompanyProfile:', error);
    throw error;
  }
};

/**
 * Build session configuration from company profile
 * Calculates difficulty distribution and topic weights
 * @param {Object} profile - Company profile
 * @param {number} totalQuestions - Total number of questions in session
 * @returns {Object} Session configuration with difficulty counts and topic weights
 */
const buildSessionConfig = (profile, totalQuestions = 30) => {
  try {
    if (!profile) {
      return {
        easyCount: Math.floor(totalQuestions * 0.33),
        mediumCount: Math.floor(totalQuestions * 0.34),
        hardCount: Math.floor(totalQuestions * 0.33),
        topicWeights: {},
        behavioralCount: Math.floor(totalQuestions * 0.5),
        technicalCount: Math.floor(totalQuestions * 0.5),
      };
    }
    
    // NEW: Calculate difficulty distribution
    const easyCount = Math.floor(
      totalQuestions * (profile.difficulty_easy / 100)
    );
    const mediumCount = Math.floor(
      totalQuestions * (profile.difficulty_medium / 100)
    );
    const hardCount =
      totalQuestions - easyCount - mediumCount;
    
    // NEW: Build topic weights (selection probabilities)
    const topicWeights = {};
    if (profile.favorite_topics && profile.favorite_topics.length > 0) {
      const weightPerTopic = 1 / profile.favorite_topics.length;
      profile.favorite_topics.forEach((topic) => {
        topicWeights[topic] = weightPerTopic;
      });
    }
    
    // NEW: Calculate behavioral vs technical split
    const behavioralCount = Math.floor(
      totalQuestions * (profile.behavioral_weight / 100)
    );
    const technicalCount =
      totalQuestions - behavioralCount;
    
    return {
      easyCount,
      mediumCount,
      hardCount,
      topicWeights,
      behavioralCount,
      technicalCount,
    };
  } catch (error) {
    console.error('Error in buildSessionConfig:', error);
    throw error;
  }
};

export {
  getAllCompanies,
  getRolesForCompany,
  getCompanyProfile,
  buildSessionConfig,
};
