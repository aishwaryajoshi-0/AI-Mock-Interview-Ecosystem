import { callLLM } from './llmService.js';
import Feedback from '../models/Feedback.js';
import { calculateFinalScore } from '../utils/scoreCalculator.js';

/**
 * Evaluates a user's answer against the ideal answer and keywords
 * @param {Object} params - Evaluation parameters
 * @param {string} params.transcript - User's spoken answer
 * @param {string} params.question - Question text
 * @param {string} params.idealAnswer - Ideal/reference answer
 * @param {string[]} params.keywords - Expected keywords
 * @param {number} params.confidenceScore - Confidence score from emotion service
 * @returns {Promise<Object>} Evaluation result with verdict, scores, and suggestion
 */
export const evaluateAnswer = async ({
  transcript,
  question,
  idealAnswer,
  keywords = [],
  confidenceScore = 50
}) => {
  try {
    // Calculate keyword match score
    const keywordScore = calculateKeywordScore(transcript, keywords);

    // Use LLM to evaluate the answer
    const llmPrompt = `
      You are an expert interview evaluator. Evaluate the following answer:

      Question: ${question}
      Ideal Answer: ${idealAnswer}
      User's Answer: ${transcript}
      Expected Keywords: ${keywords.join(', ')}

      Provide your evaluation in the following JSON format:
      {
        "verdict": "correct" | "partial" | "incorrect",
        "contentScore": number (0-100),
        "suggestion": "2-3 sentence improvement suggestion"
      }

      Criteria:
      - "correct": Answer covers all key points, includes most keywords, demonstrates good understanding
      - "partial": Answer covers some key points, includes some keywords, shows partial understanding
      - "incorrect": Answer misses key points, shows lack of understanding, or is irrelevant

      Content Score (0-100):
      - 90-100: Excellent answer with comprehensive coverage
      - 70-89: Good answer with most key points covered
      - 50-69: Adequate answer with some key points
      - 0-49: Poor answer missing key points

      Suggestion should be specific and actionable.
    `;

    const llmResponse = await callLLM({ prompt: llmPrompt });
    
    let verdict = 'partial';
    let contentScore = 50;
    let suggestion = 'Try to provide more specific examples and details in your answer.';

    try {
      const parsed = JSON.parse(llmResponse.content || llmResponse);
      verdict = parsed.verdict || 'partial';
      contentScore = parsed.contentScore || 50;
      suggestion = parsed.suggestion || suggestion;
    } catch (parseError) {
      console.error('Failed to parse LLM response:', parseError);
      // Use fallback evaluation
      const fallbackResult = fallbackEvaluation(transcript, keywords);
      verdict = fallbackResult.verdict;
      contentScore = fallbackResult.contentScore;
    }

    // Calculate final weighted score
    const finalScore = calculateFinalScore({
      contentScore,
      keywordScore,
      confidenceScore
    });

    return {
      verdict,
      contentScore,
      keywordScore,
      confidenceScore,
      finalScore,
      suggestion
    };
  } catch (error) {
    console.error('Evaluation error:', error);
    // Return default evaluation on error
    return {
      verdict: 'partial',
      contentScore: 50,
      keywordScore: calculateKeywordScore(transcript, keywords),
      confidenceScore,
      finalScore: 50,
      suggestion: 'Unable to evaluate answer. Please try again.'
    };
  }
};

/**
 * Calculates keyword match score
 * @param {string} transcript - User's answer
 * @param {string[]} keywords - Expected keywords
 * @returns {number} Keyword match percentage (0-100)
 */
const calculateKeywordScore = (transcript, keywords) => {
  if (!keywords || keywords.length === 0) return 50;
  
  const lowerTranscript = transcript.toLowerCase();
  const matchedKeywords = keywords.filter(keyword => 
    lowerTranscript.includes(keyword.toLowerCase())
  );
  
  return (matchedKeywords.length / keywords.length) * 100;
};

/**
 * Fallback evaluation when LLM fails
 * @param {string} transcript - User's answer
 * @param {string[]} keywords - Expected keywords
 * @returns {Object} Fallback evaluation result
 */
const fallbackEvaluation = (transcript, keywords) => {
  const keywordScore = calculateKeywordScore(transcript, keywords);
  
  if (keywordScore >= 70) {
    return { verdict: 'correct', contentScore: 75 };
  } else if (keywordScore >= 40) {
    return { verdict: 'partial', contentScore: 50 };
  } else {
    return { verdict: 'incorrect', contentScore: 25 };
  }
};

/**
 * Evaluates all answers in a session and stores feedback
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Overall session evaluation
 */
export const evaluateSession = async (sessionId) => {
  try {
    const Session = (await import('../models/Session.js')).default;
    const Question = (await import('../models/Question.js')).default;
    
    const session = await Session.findById(sessionId).populate('questions');
    if (!session) {
      throw new Error('Session not found');
    }

    const evaluations = [];

    for (let i = 0; i < session.answers.length; i++) {
      const answer = session.answers[i];
      const question = session.questions[i];
      const questionDoc = await Question.findById(question);
      
      if (!questionDoc) continue;

      // Get confidence score for this question
      const confidenceSample = session.confidenceSamples.find(
        cs => cs.questionId.toString() === question.toString()
      );
      const confidenceScore = confidenceSample?.confidenceScore || 50;

      const evaluation = await evaluateAnswer({
        transcript: answer.transcript || answer,
        question: questionDoc.text,
        idealAnswer: questionDoc.idealAnswer,
        keywords: questionDoc.keywords,
        confidenceScore
      });

      // Store feedback
      await Feedback.create({
        sessionId,
        userId: session.userId,
        questionId: question,
        transcript: answer.transcript || answer,
        verdict: evaluation.verdict,
        contentScore: evaluation.contentScore,
        keywordScore: evaluation.keywordScore,
        confidenceScore: evaluation.confidenceScore,
        finalScore: evaluation.finalScore,
        suggestion: evaluation.suggestion
      });

      evaluations.push(evaluation);
    }

    // Calculate overall score
    const overallScore = evaluations.length > 0
      ? evaluations.reduce((sum, eval) => sum + eval.finalScore, 0) / evaluations.length
      : 0;

    return {
      overallScore,
      evaluations,
      totalQuestions: evaluations.length
    };
  } catch (error) {
    console.error('Session evaluation error:', error);
    throw error;
  }
};
