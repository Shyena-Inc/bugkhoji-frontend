import { UserI } from "./user";
import { ResearcherLoginFormData, OrganizationLoginFormData, AdminLoginFormData,ResearcherRegisterFormData,OrganizationRegisterFormData } from "./auth";

export type AuthContextType = {
  user: UserI | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  loginAdmin: (formData: AdminLoginFormData) => Promise<void>;
  loginOrganization: (formData: OrganizationLoginFormData) => Promise<void>;
  loginResearcher: (formData: ResearcherLoginFormData) => Promise<void>;
  refreshAuthToken: () => Promise<string | undefined>;
  editProfile: (data: UserI) => Promise<void>;
  logout: (req?: boolean) => Promise<void>;
  registerResearcher: (formData: ResearcherRegisterFormData) => Promise<void>;
  registerOrganization: (formData: OrganizationRegisterFormData) => Promise<void>;
};

export interface ErrorResponseI {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
