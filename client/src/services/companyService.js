import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getAllCompanies = async () => {
  const response = await api.get(API_ENDPOINTS.COMPANIES);
  return response.data.data.companies;
};

export const getCompanyRoles = async (company) => {
  const response = await api.get(`${API_ENDPOINTS.COMPANIES}/${encodeURIComponent(company)}/roles`);
  return response.data.data.roles;
};

export const getCompanyProfile = async (company, role) => {
  const response = await api.get(`${API_ENDPOINTS.COMPANIES}/${encodeURIComponent(company)}/${encodeURIComponent(role)}`);
  return response.data.data;
};
