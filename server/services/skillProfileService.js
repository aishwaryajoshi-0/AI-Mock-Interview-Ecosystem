// MODIFIED
import SkillProfile from '../models/pg/SkillProfile.js';
import SkillHistory from '../models/pg/SkillHistory.js';

/**
 * Get or create skill profile for a user
 * @param {string} userId - MongoDB user ID (stored as string)
 * @returns {Promise<Object>} Skill profile
 */
const getOrCreateProfile = async (userId) => {
  try {
    const [profile] = await SkillProfile.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
      },
    });
    return profile;
  } catch (error) {
    console.error('Error in getOrCreateProfile:', error);
    throw error;
  }
};

/**
 * Update user skills with weighted average
 * @param {string} userId - MongoDB user ID
 * @param {string} domain - Domain/topic name
 * @param {number} newScore - New score (0-100)
 * @param {string} sessionId - Session ID for history tracking
 * @returns {Promise<Object>} Updated profile
 */
const updateSkills = async (userId, domain, newScore, sessionId = null) => {
  try {
    const profile = await getOrCreateProfile(userId);
    
    // NEW: Map domain to column name
    const domainMap = {
      'Database Management': 'dbms_score',
      'Object-Oriented Programming': 'oops_score',
      'Operating Systems': 'os_score',
      'Computer Networks': 'cn_score',
      'Data Structures & Algorithms': 'dsa_score',
      'HR & Behavioral': 'hr_score',
      'Aptitude': 'aptitude_score',
      DBMS: 'dbms_score',
      OOPS: 'oops_score',
      OS: 'os_score',
      CN: 'cn_score',
      DSA: 'dsa_score',
      HR: 'hr_score',
      Aptitude: 'aptitude_score',
    };
    
    const scoreColumn = domainMap[domain];
    if (!scoreColumn) {
      console.warn(`Unknown domain: ${domain}`);
      return profile;
    }
    
    // NEW: Weighted average calculation: 70% current, 30% new
    const currentScore = profile[scoreColumn];
    const updatedScore = currentScore * 0.7 + newScore * 0.3;
    
    // NEW: Update profile
    profile[scoreColumn] = updatedScore;
    profile.session_count += 1;
    profile.last_updated = new Date();
    
    // NEW: Recalculate overall level (average of all 7 scores)
    const allScores = [
      profile.dbms_score,
      profile.oops_score,
      profile.os_score,
      profile.cn_score,
      profile.dsa_score,
      profile.hr_score,
      profile.aptitude_score,
    ];
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    
    if (avgScore >= 75) {
      profile.overall_level = 'advanced';
    } else if (avgScore >= 50) {
      profile.overall_level = 'intermediate';
    } else {
      profile.overall_level = 'beginner';
    }
    
    await profile.save();
    
    // NEW: Insert into skill history
    await SkillHistory.create({
      user_id: userId,
      topic: domain,
      score: newScore,
      session_id: sessionId || null,
    });
    
    return profile;
  } catch (error) {
    console.error('Error in updateSkills:', error);
    throw error;
  }
};

/**
 * Get weakest topics for a user
 * @param {string} userId - MongoDB user ID
 * @param {number} count - Number of weakest topics to return
 * @returns {Promise<Array>} Array of topic names sorted by score ascending
 */
const getWeakestTopics = async (userId, count = 3) => {
  try {
    const profile = await getOrCreateProfile(userId);
    
    const topicsWithScores = [
      { topic: 'DBMS', score: profile.dbms_score },
      { topic: 'OOPS', score: profile.oops_score },
      { topic: 'OS', score: profile.os_score },
      { topic: 'CN', score: profile.cn_score },
      { topic: 'DSA', score: profile.dsa_score },
      { topic: 'HR', score: profile.hr_score },
      { topic: 'Aptitude', score: profile.aptitude_score },
    ];
    
    return topicsWithScores
      .sort((a, b) => a.score - b.score)
      .slice(0, count)
      .map((t) => t.topic);
  } catch (error) {
    console.error('Error in getWeakestTopics:', error);
    throw error;
  }
};

/**
 * Get skill history for a specific topic
 * @param {string} userId - MongoDB user ID
 * @param {string} topic - Topic name
 * @returns {Promise<Array>} Array of historical scores
 */
const getSkillHistory = async (userId, topic) => {
  try {
    const history = await SkillHistory.findAll({
      where: {
        user_id: userId,
        topic,
      },
      order: [['recorded_at', 'ASC']],
      attributes: ['score', 'recorded_at', 'session_id'],
    });
    
    return history;
  } catch (error) {
    console.error('Error in getSkillHistory:', error);
    throw error;
  }
};

export { getOrCreateProfile, updateSkills, getWeakestTopics, getSkillHistory };
