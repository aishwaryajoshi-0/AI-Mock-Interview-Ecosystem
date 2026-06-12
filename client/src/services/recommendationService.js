import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getRecommendations = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.RECOMMENDATIONS}/${userId}`);
  return response.data.data.recommendations;
};

export const getHistory = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.RECOMMENDATIONS}/${userId}/history`);
  return response.data.data.history;
};

export const markResourceComplete = async (recId, idx) => {
  const response = await api.patch(`${API_ENDPOINTS.RECOMMENDATIONS}/${recId}/resource/${idx}`);
  return response.data.data;
};

export const markTaskComplete = async (recId, day) => {
  const response = await api.patch(`${API_ENDPOINTS.RECOMMENDATIONS}/${recId}/plan/${day}`);
  return response.data.data;
};
