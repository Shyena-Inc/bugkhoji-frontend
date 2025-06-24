import api, { endpoints } from '@/utils/api';
import { AdminLoginFormData,ResearcherLoginFormData,OrganizationLoginFormData, ResearcherRegisterFormData, OrganizationRegisterFormData } from '@/types/auth';
import { UserI } from '@/types/user';

// Login
export const loginResearcher = async (data: ResearcherLoginFormData): Promise<UserI> => {
  const res = await api.post(endpoints.auth.loginResearcher, data, { withCredentials: true });
  return res.data.data;
};

export const loginOrganization = async (data: OrganizationLoginFormData): Promise<UserI> => {
  const res = await api.post(endpoints.auth.loginOrganization, data, { withCredentials: true });
  return res.data.data;
};

export const loginAdmin = async (data: AdminLoginFormData): Promise<UserI> => {
  const res = await api.post(endpoints.auth.loginAdmin, data, { withCredentials: true });
  return res.data.data;
};

// Register
export const registerResearcher = async (data: ResearcherRegisterFormData): Promise<UserI> => {
  const res = await api.post(endpoints.auth.registerResearcher, data, { withCredentials: true });
  return res.data.data;
};

export const registerOrganization = async (data: OrganizationRegisterFormData): Promise<UserI> => {
  const res = await api.post(endpoints.auth.registerOrganization, data, { withCredentials: true });
  return res.data.data;
};

// Logout
export const logout = async () => {
  return await api.get(endpoints.auth.logout, { withCredentials: true });
};
