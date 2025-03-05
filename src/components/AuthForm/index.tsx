import React from "react";
import { Link, useNavigate } from "react-router";
import { AxiosError, AxiosResponse } from "axios";
import {
  Typography,
  Flex,
  Form,
  theme,
  notification as antdNotification,
} from "antd";
import { handleAuthResponse } from "../../utils/authUtils";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import {
  LoginFormData,
  RegisterFormData,
  AuthRequestType,
  AuthError,
  AuthFormProps,
} from "../../models/Auth";
import { authApi } from "../../api/auth";
import logo from "../../assets/logo.png";
import classes from "./AuthForm.module.css";

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  userRoleToCreate = "student",
  children,
  ...props
}) => {
  const [notification, contextHolder] = antdNotification.useNotification();
  const navigate = useNavigate();
  const { token: themeToken } = theme.useToken();
  const { Title, Paragraph } = Typography;

  const modeToNavigate: AuthRequestType =
    mode === "login" ? "register" : "login";
  const navigateMessage: string =
    modeToNavigate === "login"
      ? "Already have an account?"
      : "Don't have an account?";

  const onFinish = async (formData: RegisterFormData | LoginFormData) => {
    const response: AxiosResponse | AxiosError<AuthError> =
      mode === "register"
        ? await authApi.register(formData as RegisterFormData, userRoleToCreate)
        : await authApi.login(formData as LoginFormData);

    handleAuthResponse(
      response,
      mode,
      userRoleToCreate,
      notification,
      navigate
    );
  };

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      className={userRoleToCreate === "student" ? classes.authContainer : ""}
    >
      <Flex justify="center" align="center">
        <img className={classes.logo} src={logo} alt="Logo" />
        <Title style={{ color: themeToken.colorPrimary }}>ProSkills</Title>
      </Flex>
      <Flex vertical align="center" className={classes.formWrapper}>
        <Form onFinish={onFinish} {...props}>
          {children}
          {contextHolder}
        </Form>
        <Paragraph>
          {navigateMessage}{" "}
          <Link to={`?mode=${modeToNavigate}`}>
            {capitalizeFirstLetter(modeToNavigate)}
          </Link>
        </Paragraph>
      </Flex>
    </Flex>
  );
};

export default AuthForm;
