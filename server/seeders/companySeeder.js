// MODIFIED
import CompanyProfile from '../models/pg/CompanyProfile.js';
import { sequelize } from '../config/postgres.js';

/**
 * Seeds PostgreSQL with default company interview profiles.
 * @returns {Promise<Array>} Created or updated company profile rows.
 */
const seedCompanies = async () => {
  try {
    await sequelize.sync({ force: false });

    // NEW: Company Intelligence
    const companies = [
      {
        company: 'Amazon',
        role: 'SDE-1',
        interview_pattern: 'Leadership Principles + LC medium/hard',
        difficulty_easy: 20,
        difficulty_medium: 30,
        difficulty_hard: 50,
        favorite_topics: ['DSA', 'System Design', 'Leadership Principles'],
        behavioral_weight: 40,
        technical_weight: 60,
        special_notes: 'Focus on LP stories + LC medium/hard',
      },
      {
        company: 'Google',
        role: 'SDE-1',
        interview_pattern: 'Deep algorithms and problem solving',
        difficulty_easy: 10,
        difficulty_medium: 30,
        difficulty_hard: 60,
        favorite_topics: ['DSA', 'Algorithms', 'Problem Solving'],
        behavioral_weight: 20,
        technical_weight: 80,
        special_notes: 'Strong focus on algorithms and optimization',
      },
      {
        company: 'Microsoft',
        role: 'SDE-1',
        interview_pattern: 'Balanced coding, OOP, and design',
        difficulty_easy: 20,
        difficulty_medium: 50,
        difficulty_hard: 30,
        favorite_topics: ['OOP', 'System Design', 'DSA'],
        behavioral_weight: 30,
        technical_weight: 70,
        special_notes: 'Good mix of coding and design rounds',
      },
      {
        company: 'TCS',
        role: 'Engineer',
        interview_pattern: 'Aptitude + HR + CS fundamentals',
        difficulty_easy: 60,
        difficulty_medium: 30,
        difficulty_hard: 10,
        favorite_topics: ['Aptitude', 'HR', 'Core CS'],
        behavioral_weight: 50,
        technical_weight: 50,
        special_notes: 'More emphasis on aptitude and HR fit',
      },
      {
        company: 'Infosys',
        role: 'SE',
        interview_pattern: 'CS fundamentals and aptitude',
        difficulty_easy: 50,
        difficulty_medium: 40,
        difficulty_hard: 10,
        favorite_topics: ['DBMS', 'OS', 'CN'],
        behavioral_weight: 40,
        technical_weight: 60,
        special_notes: 'Focus on core CS subjects',
      },
      {
        company: 'Wipro',
        role: 'SE',
        interview_pattern: 'Basic CS + Aptitude + HR',
        difficulty_easy: 70,
        difficulty_medium: 25,
        difficulty_hard: 5,
        favorite_topics: ['HR', 'Basic CS', 'Aptitude'],
        behavioral_weight: 50,
        technical_weight: 50,
        special_notes: 'Less technical depth, more HR and aptitude',
      },
      {
        company: 'Flipkart',
        role: 'SDE-1',
        interview_pattern: 'DSA + System Design + OOP',
        difficulty_easy: 15,
        difficulty_medium: 45,
        difficulty_hard: 40,
        favorite_topics: ['DSA', 'System Design', 'OOP'],
        behavioral_weight: 25,
        technical_weight: 75,
        special_notes: 'Strong focus on data structures and system design',
      },
      {
        company: 'Meta',
        role: 'SDE-1',
        interview_pattern: 'Hard DSA + Behavioral + System Design',
        difficulty_easy: 10,
        difficulty_medium: 35,
        difficulty_hard: 55,
        favorite_topics: ['DSA', 'Behavioral', 'System Design'],
        behavioral_weight: 35,
        technical_weight: 65,
        special_notes: 'Very challenging, expect hard algorithms problems',
      },
    ];

    const createdCompanies = await CompanyProfile.bulkCreate(companies, {
      updateOnDuplicate: [
        'interview_pattern',
        'difficulty_easy',
        'difficulty_medium',
        'difficulty_hard',
        'favorite_topics',
        'behavioral_weight',
        'technical_weight',
        'special_notes',
        'is_active',
      ],
    });

    console.log(`Seeded ${createdCompanies.length} company profiles`);
    return createdCompanies;
  } catch (error) {
    console.error('Error seeding companies:', error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCompanies()
    .then(() => {
      console.log('Company seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedCompanies };
