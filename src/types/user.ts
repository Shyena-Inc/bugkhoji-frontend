export type UserRole = "RESEARCHER" | "ORGANIZATION" | "ADMIN";

export interface BaseUser {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ResearcherUser extends BaseUser {
  role: "RESEARCHER";
  username: string;
  firstName: string;
  lastName: string;
}

export interface OrganizationUser extends BaseUser {
  role: "ORGANIZATION";
  organizationName: string;
  website: string;
  description: string;
}

export interface AdminUser extends BaseUser {
  role: "ADMIN";
  name: string; 
}

export type UserI = ResearcherUser | OrganizationUser | AdminUser;
