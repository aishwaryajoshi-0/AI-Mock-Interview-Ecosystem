import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getSkillProfile = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.SKILL_PROFILE}/${userId}`);
  return response.data.data;
};

export const getWeakestTopics = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.SKILL_PROFILE}/${userId}/weakest`);
  return response.data.data.weakTopics;
};

export const getSkillHistory = async (userId, topic) => {
  const response = await api.get(`${API_ENDPOINTS.SKILL_PROFILE}/${userId}/history/${topic}`);
  return response.data.data;
};
