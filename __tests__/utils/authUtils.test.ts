import { handleAuthResponse } from "../../src/utils/authUtils";
import { useAuthStore } from "../../src/store/useAuthStore";
import { authApi } from "../../src/api/auth";
import { UserRoles } from "../../src/models/User";
import { AxiosResponse, AxiosError } from "axios";
import { APIError } from "../../src/models/APIResponse";
import { NotificationInstance } from "antd/es/notification/interface";

jest.mock("../../src/store/useAuthStore");
jest.mock("../../src/api/auth");

describe("authUtils", () => {
  const mockNotification: NotificationInstance = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn(),
  };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles successful login", async () => {
    const mockUser = { id: 1, email: "test@test.com", role: UserRoles.STUDENT };
    (authApi.getToken as jest.Mock).mockResolvedValue({ data: mockUser });
    (useAuthStore.getState as jest.Mock).mockReturnValue({
      resetLoginAttempts: jest.fn(),
      setUser: jest.fn(),
    });

    const response: AxiosResponse = {
      data: { token: "fake-token" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    await handleAuthResponse(
      response,
      "login",
      UserRoles.STUDENT,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles successful registration", async () => {
    const mockUser = { id: 1, email: "test@test.com", role: UserRoles.STUDENT };
    (authApi.getToken as jest.Mock).mockResolvedValue({ data: mockUser });
    (useAuthStore.getState as jest.Mock).mockReturnValue({
      resetLoginAttempts: jest.fn(),
      setUser: jest.fn(),
    });

    const response: AxiosResponse = {
      data: { token: "fake-token" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    await handleAuthResponse(
      response,
      "register",
      UserRoles.STUDENT,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });

  test("handles failed login", async () => {
    const error: AxiosError<APIError> = {
      isAxiosError: true,
      response: {
        status: 401,
        data: { detail: "Invalid credentials" },
        statusText: "Unauthorized",
        headers: {},
        config: {} as any,
      },
      config: {} as any,
      name: "AxiosError",
      message: "Request failed with status code 401",
      toJSON: () => ({}),
    };

    (useAuthStore.getState as jest.Mock).mockReturnValue({
      incrementLoginAttempts: jest.fn(),
    });

    await handleAuthResponse(
      error,
      "login",
      UserRoles.STUDENT,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.error).toHaveBeenCalled();
  });

  test("handles failed registration", async () => {
    const error: AxiosError<APIError> = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { detail: "Email already exists" },
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      },
      config: {} as any,
      name: "AxiosError",
      message: "Request failed with status code 400",
      toJSON: () => ({}),
    };

    (useAuthStore.getState as jest.Mock).mockReturnValue({
      incrementLoginAttempts: jest.fn(),
    });

    await handleAuthResponse(
      error,
      "register",
      UserRoles.STUDENT,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.error).toHaveBeenCalled();
  });

  test("handles network error", async () => {
    const error: AxiosError<APIError> = {
      isAxiosError: true,
      message: "Network Error",
      name: "AxiosError",
      config: {} as any,
      toJSON: () => ({}),
    };

    (useAuthStore.getState as jest.Mock).mockReturnValue({
      incrementLoginAttempts: jest.fn(),
    });

    await handleAuthResponse(
      error,
      "login",
      UserRoles.STUDENT,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.error).toHaveBeenCalled();
  });

  test("handles teacher registration success", async () => {
    const response: AxiosResponse = {
      data: { message: "Teacher registered successfully" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    (useAuthStore.getState as jest.Mock).mockReturnValue({
      resetLoginAttempts: jest.fn(),
      setUser: jest.fn(),
    });

    await handleAuthResponse(
      response,
      "register",
      UserRoles.TEACHER,
      mockNotification,
      mockNavigate
    );

    expect(mockNotification.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
