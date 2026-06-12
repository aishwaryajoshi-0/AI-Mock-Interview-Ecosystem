import mongoose from 'mongoose';

/**
 * Recommendation Schema - Stores learning recommendations per user
 * Contains resources, practice questions, and weekly learning plan
 * Expires after 30 days (TTL index)
 */
const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    weakTopic: {
      type: String,
      required: true,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['video', 'article', 'practice', 'course'],
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    practiceQuestions: [String],
    weeklyPlan: [
      {
        day: {
          type: Number,
          min: 1,
          max: 7,
        },
        task: String,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  { timestamps: true }
);

/**
 * TTL index - automatically delete expired recommendations
 */
recommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
recommendationSchema.index({ userId: 1, generatedAt: -1 });

export default mongoose.model('Recommendation', recommendationSchema);
