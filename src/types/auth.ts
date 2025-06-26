export type ResearcherRegisterFormData = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'RESEARCHER';
};

export type OrganizationRegisterFormData = {
  email: string;
  organizationName: string;
  website: string;
  description: string;
  password: string;
  role: 'ORGANIZATION';
};

export type ResearcherLoginFormData = {
  email: string;
  password: string;
};

export type OrganizationLoginFormData = {
  email: string;
  password: string;
};

export type AdminLoginFormData = {
  email: string;
  password: string;
};
