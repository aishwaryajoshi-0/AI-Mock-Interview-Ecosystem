import axios from 'axios';
import { env } from '../config/env.js';
import { countTokens } from '../utils/tokenCounter.js';

/**
 * Call an LLM endpoint to evaluate a transcript and generate feedback.
 * @param {{ transcript: string, question: string }} params
 * @returns {{ feedbackText: string, idealAnswer: string }}
 */
export const callLLM = async ({ transcript, question }) => {
  const prompt = `Evaluate this answer against the question:\nQuestion: ${question}\nAnswer: ${transcript}\nProvide concise improvement feedback and an ideal answer.`;
  const tokenEstimate = countTokens(prompt);

  const headers = {
    Authorization: `Bearer ${env.LLM_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const payload = {
    prompt,
    max_tokens: 400,
    temperature: 0.7,
    tokenEstimate,
  };

  try {
    const response = await axios.post(`${env.AI_ENGINE_URL}/llm`, payload, { headers });
    return {
      feedbackText: response.data.feedbackText || 'Unable to generate detailed feedback',
      idealAnswer: response.data.idealAnswer || 'Ideal answer is unavailable',
    };
  } catch (error) {
    return {
      feedbackText: 'Feedback service unavailable',
      idealAnswer: '',
    };
  }
};
