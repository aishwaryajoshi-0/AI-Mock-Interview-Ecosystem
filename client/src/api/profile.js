import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const profileAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Complete onboarding (resume upload or skill form)
  completeOnboarding: async (data) => {
    const formData = new FormData();
    
    if (data.method === 'resume' && data.file) {
      formData.append('file', data.file);
    }
    
    formData.append('method', data.method);
    formData.append('skillProfile', JSON.stringify(data.skillProfile));

    const response = await axios.post(`${API_BASE_URL}/profile/onboarding`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await axios.put(`${API_BASE_URL}/profile/me`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mockInterviewToken')}`
      }
    });
    return response.data;
  }
};
