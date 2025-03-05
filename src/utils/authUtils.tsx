import axios, { AxiosError, AxiosResponse } from "axios";
import { LoaderFunction, redirect, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { PATHS } from "../routes/paths";
import { UserRegistration, UserLogin } from "../models/User";
import {
  RegisterFormData,
  LoginFormData,
  AuthResponse,
  DecodedAccessToken,
  AuthError,
  UserRoles,
} from "../models/Auth";
import api from "../api";
import { useAuthStore } from "../store/useAuthStore";
import { ArgsProps } from "antd/es/notification";
import { handleAxiosError } from "./axiosErrorHandler";
import { capitalizeFirstLetter } from "./stringUtils";
import { NotificationInstance } from "antd/es/notification/interface";
import { authApi } from "../api/auth";

export const getRequestBody = {
  register: (formData: RegisterFormData) => {
    const userBody: UserRegistration = {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      password: formData.password,
      role: "student",
    };

    return userBody;
  },
  login: (formData: LoginFormData) => {
    const userBody: UserLogin = {
      email: formData.email,
      password: formData.password,
    };

    return userBody;
  },
};

export const handleAuthResponse = async (
  response: AxiosResponse | AxiosError<AuthError>,
  mode: "login" | "register",
  userRoleToCreate: UserRoles,
  notification: NotificationInstance,
  navigate: any
) => {
  let notificationConfig: ArgsProps = {
    message: `${capitalizeFirstLetter(mode)} Attempt Unsuccessful`,
    description: `Unable to ${mode}`,
    placement: "topRight",
    duration: 10,
  };

  if (!axios.isAxiosError(response)) {
    if (mode === "login") {
      const { data } = await authApi.getToken();
      useAuthStore.getState().setUser(data);
    }
    navigate(PATHS.HOME);
  } else {
    handleAxiosError(response, notification, notificationConfig);
  }
};

export function setTokenDuration(token: string) {
  const decodedToken: DecodedAccessToken = jwtDecode(token);
  console.log(decodedToken, "decoded");

  const expiration = new Date(+decodedToken.exp * 1000);
  localStorage.setItem("expiration", expiration.toISOString());
}

export function setTokenData(response: AxiosResponse<AuthResponse>) {
  // const token = response?.data.access_token;
  // localStorage.setItem("token", token);
  // localStorage.setItem("refreshToken", response?.data.refresh_token); // TODO: remove when the logic on backend is done
  // setTokenDuration(token);
  // const setAuthData = useAuthStore.getState().setAuthData;
  // setAuthData(response.data);
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration") as string;
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export async function getAuthToken() {
  // const token = localStorage.getItem("token");
  // const refreshToken: string = localStorage.getItem("refreshToken") || ""; // TODO: remove when the logic on backend is done

  // if (!token) {
  //   return null;
  // }

  // const tokenDuration = getTokenDuration();

  // if (tokenDuration < 0) {
  //   const response = await api.post(
  //     `/auth/refresh?refresh_token=${refreshToken}`
  //   );

  //   const newToken = response.data.access_token;

  //   if (newToken) {
  //     localStorage.setItem("token", newToken);
  //     setTokenDuration(newToken);
  //     return newToken;
  //   }

  //   return "EXPIRED";
  // }

  // return token;
  return null;
}

export function tokenLoader() {
  return getAuthToken();
}

export async function checkAuthLoader() {
  const token = await getAuthToken();

  if (!token) {
    return redirect(PATHS.AUTH);
  }

  return null;
}

export const rootLoader: LoaderFunction = async () => {
  const checkAuth = useAuthStore.getState().checkAuth;
  await checkAuth();

  return null;
};

export const protectedLoader: LoaderFunction = async () => {
  const { isAuthenticated, checkAuth } = useAuthStore.getState();

  if (!isAuthenticated) {
    await checkAuth();
  }

  if (!useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.AUTH);
  }

  return null;
};

