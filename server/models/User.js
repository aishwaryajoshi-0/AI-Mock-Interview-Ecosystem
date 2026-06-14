import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String },
  resumeUrl: { type: String, default: null },
  skillProfile: { type: mongoose.Schema.Types.Mixed, default: null },
  onboardingComplete: { type: Boolean, default: false },
  googleId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
