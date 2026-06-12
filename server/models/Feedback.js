import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: false },
  transcript: { type: String, required: true },
  sentimentScore: { type: Number, default: 0 },
  fillerWordCount: { type: Number, default: 0 },
  keywordsMatched: [{ type: String }],
  contentScore: { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Feedback', feedbackSchema);
