export type UserRole = "RESEARCHER" | "ORGANIZATION" | "ADMIN";

export interface BaseUser {
  id: number;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
}

export interface ResearcherUser extends BaseUser {
  role: "RESEARCHER";
  username: string;
  firstName: string;
  lastName: string;
  logo?: string;
}

export interface OrganizationUser extends BaseUser {
  role: "ORGANIZATION";
  organizationName: string;
  organizationId?: string;
  website?: string;
  description?: string;
  logo?: string;
  verified?: boolean;
  verificationStatus?: string;
}

export interface AdminUser extends BaseUser {
  role: "ADMIN";
  name: string; 
}

export type UserI = ResearcherUser | OrganizationUser | AdminUser;
