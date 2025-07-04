export type ResearcherRegisterFormData = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  termsAccepted:boolean;
  role: 'RESEARCHER';
};

export type OrganizationRegisterFormData = {
  email: string;
  organizationName: string;
  website: string;
  description: string;
  password: string;
  termsAccepted:boolean;
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
