export type UserRole = "reader" | "author" | "organization";
export type SystemRole = "reader" | "author" | "organization" | "manager_admin";

export type UserRegistrationData = {
  username: string;
  email: string;
  password: string;
  verificationCode: string;

  userType: UserRole | "";

  lastName: string;
  firstName: string;
  fatherName: string;
  phone_number: string;
  photo: File | null;

  specialization?: string;
  bio?: string;

  organization_name?: string;
  legal_name?: string;
  address?: string;
  website?: string;

  contractAccepted: boolean;
};

export interface User {
  id: number;
  profile_id?: number;
  email: string;
  role: SystemRole;
  username?: string;
  first_name?: string;
  last_name?: string;
  surname?: string;
  father_name?: string;
  phone?: string;
  phone_number?: string;
  address?: string;
  logo?: string;
  photo?: string;
  website?: string;
  description?: string;
  name_of_organization?: string;
}