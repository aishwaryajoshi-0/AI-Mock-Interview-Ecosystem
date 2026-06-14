import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    transcript: { type: String, default: '' },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const confidenceSampleSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    confidenceScore: { type: Number, default: 50 },
    capturedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['hr', 'technical', 'dsa', 'company-specific'], default: 'technical' },
  company: { type: String, enum: ['amazon', 'microsoft', 'deshaw', null], default: null },
  domain: { type: String, trim: true, default: 'General' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  numQuestions: { type: Number, default: 5 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [answerSchema],
  scores: [{ type: Number, default: 0 }],
  confidenceSamples: [confidenceSampleSchema],
  overallScore: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  targetCompany: { type: String, default: null },
  targetRole: { type: String, default: null },
  currentDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  followUpHistory: [
    {
      questionText: String,
      userAnswer: String,
      answeredAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

export default mongoose.model('Session', sessionSchema);
