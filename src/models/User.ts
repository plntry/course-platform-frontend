export type UserRoles = "admin" | "teacher" | "student";

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "student";
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRoles;
}
