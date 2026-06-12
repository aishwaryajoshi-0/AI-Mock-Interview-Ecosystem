import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String },
  resumeUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
