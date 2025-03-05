import axios from "axios";
import { UserLogin, UserRegistration } from "../models/User";
import {
  RegisterFormData,
  LoginFormData,
  UserRoles,
  AuthRequestType,
} from "../models/Auth";
import { getRequestBody } from "../utils/authUtils";
import api from ".";

const requestUrls = {
  register: {
    student: "/auth",
    teacher: "/auth/register/teacher",
    admin: "/auth/create/admin",
  },
  login: "/auth/token",
  getToken: "/auth/me",
  refreshToken: "/auth/refresh",
};

export const shouldIncludeAuth = {
  register: ["teacher", "admin"],
};

export const authApi = {
  register: async (formData: RegisterFormData, userRole: UserRoles) => {
    const body: UserRegistration = getRequestBody.register(formData);
    return await authPostRequest(body, "register", userRole);
  },
  login: async (formData: LoginFormData) => {
    const body: UserLogin = getRequestBody.login(formData);
    return await authPostRequest(body, "login");
  },
  getToken: async () => {
    return await api.get(requestUrls.getToken);
  },
  refreshToken: async () => {
    return await api.get(requestUrls.refreshToken);
  },
};

async function authPostRequest(
  body: UserRegistration | UserLogin,
  reqType: AuthRequestType,
  userRole?: UserRoles | null
) {
  try {
    let url: string = requestUrls.login;

    if (reqType == "register" && userRole) {
      url = requestUrls[reqType][userRole];
    }

    return await api.post(url, body);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      return error;
    }

    throw new Error(
      "Unexpected error occurred while making an auth POST request."
    );
  }
}
