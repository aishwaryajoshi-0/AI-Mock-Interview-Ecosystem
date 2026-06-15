import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const progressAPI = {
  // Get progress overview for current user
  getProgressOverview: async () => {
    const response = await axios.get(`${API_BASE_URL}/progress/overview`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Get detailed feedback for a specific session
  getSessionFeedback: async (sessionId) => {
    const response = await axios.get(`${API_BASE_URL}/progress/session/${sessionId}/feedback`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  }
};
