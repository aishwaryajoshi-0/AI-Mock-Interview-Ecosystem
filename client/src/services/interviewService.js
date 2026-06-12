import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const startSession = async (payload) => {
  const response = await api.post(API_ENDPOINTS.INTERVIEW_SESSIONS, payload);
  return response.data;
};

export const submitAnswer = async (payload) => {
  const response = await api.post(API_ENDPOINTS.SUBMIT_ANSWER, payload);
  return response.data;
};

export const endSession = async (sessionId) => {
  const response = await api.post(API_ENDPOINTS.END_SESSION, { sessionId });
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get("/api/interview/all");
  return response.data;
};

export const getFollowUp = async (payload) => {
  const response = await api.post(API_ENDPOINTS.FOLLOW_UP, payload);
  return response.data;
};
