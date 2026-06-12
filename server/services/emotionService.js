import axios from 'axios';
import { env } from '../config/env.js';

/**
 * Send visual data to the AI engine emotion endpoint.
 * @param {{ frameData: string }} params
 * @returns {{ confidenceScore: number }}
 */
export const callEmotion = async ({ frameData }) => {
  try {
    const response = await axios.post(`${env.AI_ENGINE_URL}/emotion`, { frameData });
    return {
      confidenceScore: response.data.confidenceScore ?? 50,
    };
  } catch (error) {
    return { confidenceScore: 50 };
  }
};
