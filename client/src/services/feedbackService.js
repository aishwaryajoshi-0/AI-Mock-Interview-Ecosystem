import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getFeedback = async (sessionId) => {
  const response = await api.get(`${API_ENDPOINTS.FEEDBACK}/${sessionId}`);
  return response.data;
};

export const getSessionFeedback = async (sessionId) => {
  const response = await api.get(`${API_ENDPOINTS.SESSION_FEEDBACK}/${sessionId}`);
  return response.data;
};
