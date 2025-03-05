export enum UserRoles {
  Admin = "admin",
  Teacher = "teacher",
  Student = "student",
}

export interface UserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRoles.Student;
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
