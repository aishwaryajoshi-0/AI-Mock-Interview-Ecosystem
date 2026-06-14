// MODIFIED
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter, generalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import questionRoutes from './routes/question.routes.js';
import adminRoutes from './routes/admin.routes.js';
// NEW: Route registration
import memoryRoutes from './routes/memory.routes.js';
import skillProfileRoutes from './routes/skillProfile.routes.js';
import companyRoutes from './routes/company.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import profileRoutes from './routes/profile.routes.js';
import progressRoutes from './routes/progress.routes.js';

const app = express();

app.use(generalLimiter);
app.use(cors());
app.use(helmet());
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.json({ success: true, data: 'AI Mock Interview Ecosystem API is running' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
// NEW: Route registration
app.use('/api/memory', memoryRoutes);
app.use('/api/skill-profile', skillProfileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);

app.use(errorHandler);

export default app;
