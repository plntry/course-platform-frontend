import axios, { AxiosError, AxiosResponse } from "axios";
import { LoaderFunction, redirect } from "react-router";
import { PATHS } from "../routes/paths";
import { UserRegistration, UserLogin, UserRoles } from "../models/User";
import {
  RegisterFormData,
  LoginFormData,
  AuthError,
  AuthRequestType,
} from "../models/Auth";
import { useAuthStore } from "../store/useAuthStore";
import { ArgsProps } from "antd/es/notification";
import { handleAxiosError } from "./axiosUtils";
import { capitalizeFirstLetter } from "./stringUtils";
import { NotificationInstance } from "antd/es/notification/interface";
import { authApi } from "../api/auth";

export const getRequestBody = {
  register: (formData: RegisterFormData) => {
    const userBody: UserRegistration = {
      email: formData.email,
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      password: formData.password,
      role: UserRoles.Student,
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
  mode: AuthRequestType,
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

      navigate(PATHS.HOME);
      return;
    }

    if (userRoleToCreate !== UserRoles.Student) {
      notification.success({
        ...notificationConfig,
        message: `${capitalizeFirstLetter(mode)} Attempt Successful`,
        description: `The user of ${userRoleToCreate} role was created`,
      });
    }

    navigate(PATHS.AUTH);
  } else {
    handleAxiosError(response, notification, notificationConfig);
  }
};

export const rootLoader: LoaderFunction = async () => {
  const { isAuthenticated, checkAuth } = useAuthStore.getState();

  if (!isAuthenticated) {
    await checkAuth();
  }

  if (!useAuthStore.getState().isAuthenticated) {
    return redirect(PATHS.AUTH);
  }

  return null;
};
