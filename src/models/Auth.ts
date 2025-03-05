import { FormProps } from "antd";
import { UserRoles } from "./User";

export type AuthRequestType = "register" | "login";

export interface RegisterFormData {
  username: string;
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

export interface AuthResponse {
  access_token: any;
  refresh_token: string;
  token_type: string;
}

export interface AuthError {
  detail?: string | { msg: string }[];
}

export interface DecodedAccessToken {
  id: number;
  sub: string;
  role: string;
  exp: number;
  token_type: string;
}
