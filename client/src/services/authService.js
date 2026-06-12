import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const login = async (payload) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, payload);
  return response.data.data;
};

export const verifyLoginOtp = async (payload) => {
  const response = await api.post(API_ENDPOINTS.VERIFY_LOGIN_OTP, payload);
  return response.data.data;
};

export const register = async (payload) => {
  const response = await api.post(API_ENDPOINTS.REGISTER, payload);
  return response.data.data;
};

export const verifyRegisterOtp = async (payload) => {
  const response = await api.post(API_ENDPOINTS.VERIFY_REGISTER_OTP, payload);
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get(API_ENDPOINTS.PROFILE);
  return response.data.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("mockInterviewToken");
};
