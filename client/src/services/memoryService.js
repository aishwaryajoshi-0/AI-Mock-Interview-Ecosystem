import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getMemory = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.MEMORY}/${userId}`);
  return response.data.data;
};

export const resetMemory = async (userId) => {
  const response = await api.delete(`${API_ENDPOINTS.MEMORY}/${userId}/reset`);
  return response.data.data;
};
