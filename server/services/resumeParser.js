import axios from 'axios';
import { env } from '../config/env.js';

/**
 * Parse a resume PDF file URL and use LLM to generate interview questions.
 * @param {{ resumeUrl: string }} params
 * @returns {{ questions: string[] }}
 */
export const parseResume = async ({ resumeUrl }) => {
  if (!resumeUrl) {
    return { questions: [] };
  }

  try {
    const response = await axios.post(`${env.AI_ENGINE_URL}/resume`, { resumeUrl });
    return {
      questions: response.data.questions || [],
    };
  } catch (error) {
    return { questions: [] };
  }
};
