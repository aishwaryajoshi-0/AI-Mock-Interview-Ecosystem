import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  type: { type: String, enum: ['technical', 'HR', 'behavioral'], required: true },
  tags: [{ type: String, trim: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);
