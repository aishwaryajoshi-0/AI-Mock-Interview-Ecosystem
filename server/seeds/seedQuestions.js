import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { env } from '../config/env.js';
import hrQuestions from './data/hrQuestions.json';
import technicalQuestions from './data/technicalQuestions.json';
import dsaQuestions from './data/dsaQuestions.json';
import companyQuestions from './data/companyQuestions.json';

const seedQuestions = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Combine all questions
    const allQuestions = [
      ...hrQuestions,
      ...technicalQuestions,
      ...dsaQuestions,
      ...companyQuestions
    ];

    // Insert questions in batches
    const batchSize = 100;
    for (let i = 0; i < allQuestions.length; i += batchSize) {
      const batch = allQuestions.slice(i, i + batchSize);
      await Question.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allQuestions.length / batchSize)}`);
    }

    console.log(`Successfully seeded ${allQuestions.length} questions`);
    
    // Count questions by type
    const counts = await Question.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    console.log('Question counts by type:', counts);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
