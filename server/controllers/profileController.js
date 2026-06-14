import User from '../models/User.js';
import { apiError, apiSuccess } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { parseResume } from '../services/resumeParser.js';
import { callLLM } from '../services/llmService.js';

/**
 * Handles user onboarding - either via resume upload or skill form
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const completeOnboarding = async (req, res, next) => {
  try {
    const { method, skillProfile } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    if (user.onboardingComplete) {
      return apiError(res, 'Onboarding already completed', 400);
    }

    let finalSkillProfile = skillProfile;

    // Method A: Resume upload
    if (method === 'resume' && req.file) {
      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.path);
        
        // Parse resume to extract skills
        const resumeText = await parseResume(req.file.path);
        
        // Use LLM to analyze resume and extract skill profile
        const llmPrompt = `
          Analyze this resume text and extract a structured skill profile in JSON format:
          {
            "primaryDomain": "e.g., Web Development, Data Science, DSA, etc.",
            "languages": ["array of programming languages"],
            "frameworks": ["array of frameworks"],
            "experienceLevel": "Beginner/Intermediate/Advanced",
            "confidence": {
              "dsa": number 1-5,
              "systemDesign": number 1-5,
              "communication": number 1-5,
              "behavioral": number 1-5
            },
            "skills": ["array of technical skills"],
            "weakAreas": ["array of areas to improve"]
          }
          
          Resume text:
          ${resumeText}
        `;

        const llmResponse = await callLLM({ prompt: llmPrompt });
        
        try {
          finalSkillProfile = JSON.parse(llmResponse.content || llmResponse);
        } catch (parseError) {
          // If LLM response is not valid JSON, create a basic profile
          finalSkillProfile = {
            primaryDomain: 'General',
            languages: [],
            frameworks: [],
            experienceLevel: 'Beginner',
            confidence: { dsa: 3, systemDesign: 3, communication: 3, behavioral: 3 },
            skills: [],
            weakAreas: []
          };
        }

        user.resumeUrl = cloudinaryResult.secure_url;
      } catch (error) {
        console.error('Resume processing error:', error);
        return apiError(res, 'Failed to process resume', 500);
      }
    }
    // Method B: Skill form
    else if (method === 'form' && skillProfile) {
      finalSkillProfile = skillProfile;
    } else {
      return apiError(res, 'Invalid onboarding method or missing data', 400);
    }

    // Update user with skill profile and mark onboarding as complete
    user.skillProfile = finalSkillProfile;
    user.onboardingComplete = true;
    user.updatedAt = Date.now();
    await user.save();

    return apiSuccess(
      res,
      { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeUrl: user.resumeUrl,
          skillProfile: user.skillProfile,
          onboardingComplete: user.onboardingComplete
        }
      },
      'Onboarding completed successfully'
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Get current user profile
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    return apiSuccess(res, user, 'Profile retrieved successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * Update user profile
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, skillProfile } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return apiError(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (skillProfile) user.skillProfile = skillProfile;
    user.updatedAt = Date.now();
    
    await user.save();

    return apiSuccess(
      res,
      { user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, skillProfile: user.skillProfile } },
      'Profile updated successfully'
    );
  } catch (error) {
    return next(error);
  }
};
