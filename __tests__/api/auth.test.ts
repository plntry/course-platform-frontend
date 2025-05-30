import { authApi } from "../../src/api/auth";
import api from "../../src/api";
import { getAxiosError } from "../../src/utils/axiosUtils";
import { UserRoles } from "../../src/models/User";

jest.mock("../../src/api");
jest.mock("../../src/utils/axiosUtils");

describe("authApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("register success", async () => {
    const mockResponse = { data: { id: 1 } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const formData = {
      email: "test@test.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
      confirm: "password123",
    };

    const result = await authApi.register(formData, UserRoles.STUDENT);
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/users", formData);
  });

  test("register teacher success", async () => {
    const mockResponse = { data: { id: 1 } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const formData = {
      email: "teacher@test.com",
      password: "password123",
      first_name: "Test",
      last_name: "Teacher",
      confirm: "password123",
    };

    const result = await authApi.register(formData, UserRoles.TEACHER);
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/register/teacher", formData);
  });

  test("login success", async () => {
    const mockResponse = { data: { token: "fake-token" } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const formData = {
      email: "test@test.com",
      password: "password123",
    };

    const result = await authApi.login(formData);
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/token", formData);
  });

  test("logout success", async () => {
    const mockResponse = { data: { message: "Logged out successfully" } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authApi.logout();
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/logout");
  });

  test("getToken success", async () => {
    const mockResponse = { data: { id: 1, email: "test@test.com" } };
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authApi.getToken();
    expect(result).toEqual(mockResponse);
    expect(api.get).toHaveBeenCalledWith("/auth/me");
  });

  test("refreshToken success", async () => {
    const mockResponse = { data: { token: "new-token" } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authApi.refreshToken();
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/refresh");
  });

  test("handles register error", async () => {
    const mockError = new Error("Registration failed");
    (api.post as jest.Mock).mockRejectedValue(mockError);
    (getAxiosError as jest.Mock).mockReturnValue(mockError);

    const formData = {
      email: "test@test.com",
      password: "password123",
      first_name: "Test",
      last_name: "User",
      confirm: "password123",
    };

    const result = await authApi.register(formData, UserRoles.STUDENT);
    expect(result).toEqual(mockError);
  });

  test("handles login error", async () => {
    const mockError = new Error("Login failed");
    (api.post as jest.Mock).mockRejectedValue(mockError);
    (getAxiosError as jest.Mock).mockReturnValue(mockError);

    const formData = {
      email: "test@test.com",
      password: "wrong-password",
    };

    const result = await authApi.login(formData);
    expect(result).toEqual(mockError);
  });
});
