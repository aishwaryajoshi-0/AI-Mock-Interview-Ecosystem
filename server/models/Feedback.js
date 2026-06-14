import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: false },
  transcript: { type: String, required: true },
  verdict: { type: String, enum: ['correct', 'partial', 'incorrect'], default: 'partial' },
  sentimentScore: { type: Number, default: 0 },
  fillerWordCount: { type: Number, default: 0 },
  keywordsMatched: [{ type: String }],
  contentScore: { type: Number, default: 0 },
  keywordScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 50 },
  finalScore: { type: Number, default: 0 },
  suggestion: { type: String, default: '' },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ sessionId: 1, questionId: 1 });

export default mongoose.model('Feedback', feedbackSchema);
