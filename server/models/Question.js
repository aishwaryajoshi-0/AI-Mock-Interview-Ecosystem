import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  type: { type: String, enum: ['hr', 'technical', 'dsa', 'company-specific'], required: true },
  company: { type: String, enum: ['amazon', 'microsoft', 'deshaw', null], default: null },
  domain: { type: String, trim: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  idealAnswer: { type: String, default: '' },
  keywords: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
});

questionSchema.index({ type: 1, company: 1, difficulty: 1, domain: 1 });

export default mongoose.model('Question', questionSchema);
