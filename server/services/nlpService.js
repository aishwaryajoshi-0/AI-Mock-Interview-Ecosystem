import axios from 'axios';
import { env } from '../config/env.js';

/**
 * Send transcript text to the AI engine NLP endpoint.
 * @param {string} transcript
 * @returns {{ sentimentScore: number, fillerWordCount: number, keywordsMatched: string[] }}
 */
export const callNLP = async (transcript) => {
  try {
    const response = await axios.post(`${env.AI_ENGINE_URL}/nlp`, { transcript });
    return {
      sentimentScore: response.data.sentimentScore ?? 50,
      fillerWordCount: response.data.fillerWordCount ?? 0,
      keywordsMatched: response.data.keywordsMatched ?? [],
    };
  } catch (error) {
    return {
      sentimentScore: 50,
      fillerWordCount: 0,
      keywordsMatched: [],
    };
  }
};
