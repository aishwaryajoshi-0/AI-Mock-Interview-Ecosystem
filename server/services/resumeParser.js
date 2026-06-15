import axios from 'axios';
import { env } from '../config/env.js';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Parse a resume PDF file and extract text content
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} Extracted text from PDF
 */
export const parseResume = async (filePath) => {
  if (!filePath) {
    return '';
  }

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    return '';
  }
};

/**
 * Parse a resume PDF file URL and use LLM to generate interview questions.
 * @param {{ resumeUrl: string }} params
 * @returns {{ questions: string[] }}
 */
export const parseResumeFromUrl = async ({ resumeUrl }) => {
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
