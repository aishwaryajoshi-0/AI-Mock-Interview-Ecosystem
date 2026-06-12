// MODIFIED
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true, trim: true },
  questions: [{ type: String }],
  answers: [{ type: String }],
  scores: [{ type: Number, default: 0 }],
  overallScore: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  // NEW: Company Intelligence fields
  targetCompany: { type: String, default: null },
  targetRole: { type: String, default: null },
  // NEW: Adaptive Difficulty fields
  currentDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  followUpHistory: [
    {
      questionText: String,
      userAnswer: String,
      answeredAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Session', sessionSchema);
