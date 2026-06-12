import { body } from 'express-validator';

export const startSessionValidator = [
  body('domain').trim().notEmpty().withMessage('Domain is required'),
];

export const submitAnswerValidator = [
  body('sessionId').notEmpty().withMessage('sessionId is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
];
