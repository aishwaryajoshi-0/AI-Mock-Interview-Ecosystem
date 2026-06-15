import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const interviewAPI = {
  // Start a new interview session
  startSession: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/interview/start`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Submit an answer for a question
  submitAnswer: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/interview/submit-answer`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // End an interview session
  endSession: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/interview/end`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    const response = await axios.get(`${API_BASE_URL}/interview/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Get all sessions for current user
  getAllSessions: async () => {
    const response = await axios.get(`${API_BASE_URL}/interview/sessions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Get questions by filter
  getQuestionsByFilter: async (filters) => {
    const response = await axios.get(`${API_BASE_URL}/questions`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  }
};
