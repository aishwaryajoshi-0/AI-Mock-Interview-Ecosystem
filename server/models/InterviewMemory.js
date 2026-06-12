// MODIFIED
import mongoose from 'mongoose';

/**
 * Interview Memory Schema - Stores user's interview history and learning progress
 * Used for:
 * - Avoiding repetitive questions
 * - Identifying weak topics
 * - Tracking learning progress trends
 */
const interviewMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    coveredTopics: [String], // Array of topics already covered
    weakTopics: [String], // Topics where user scored <50
    strongTopics: [String], // Topics where user scored >75
    askedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    exposureHistory: [
      {
        topic: String,
        count: { type: Number, default: 0 },
        lastAsked: Date,
      },
    ],
    learningProgress: [
      {
        topic: String,
        scoreHistory: [Number],
        trend: {
          type: String,
          enum: ['improving', 'declining', 'stable'],
          default: 'stable',
        },
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Index for efficient queries
 */
interviewMemorySchema.index({ userId: 1 });

export default mongoose.model('InterviewMemory', interviewMemorySchema);
