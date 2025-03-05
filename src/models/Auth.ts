import { FormProps } from "antd";
import { UserRoles } from "./User";

export type AuthRequestType = "register" | "login";

export interface RegisterFormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthFormProps extends FormProps {
  mode: AuthRequestType;
  userRoleToCreate?: UserRoles;
  children: React.ReactNode;
}

export interface AuthError {
  detail?: string | { msg: string }[];
}
