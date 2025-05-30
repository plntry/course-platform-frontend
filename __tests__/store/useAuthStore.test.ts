import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../../src/store/useAuthStore";
import { authApi } from "../../src/api/auth";
import { UserRoles } from "../../src/models/User";

jest.mock("../../src/api/auth");

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initial state", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.loginAttempts).toBe(0);
  });

  test("setUser updates state correctly", () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, email: "test@test.com", role: UserRoles.STUDENT };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBeTruthy();
  });

  test("loginAttempts management", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.incrementLoginAttempts();
    });
    expect(result.current.loginAttempts).toBe(1);

    act(() => {
      result.current.resetLoginAttempts();
    });
    expect(result.current.loginAttempts).toBe(0);
  });

  test("checkAuth success flow", async () => {
    const mockUser = { id: 1, email: "test@test.com", role: UserRoles.STUDENT };
    (authApi.getToken as jest.Mock).mockResolvedValue({ data: mockUser });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.checkAuth();
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBeTruthy();
  });

  test("checkAuth failure flow", async () => {
    (authApi.getToken as jest.Mock).mockRejectedValue(new Error("Auth failed"));
    (authApi.refreshToken as jest.Mock).mockRejectedValue(
      new Error("Refresh failed")
    );

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.checkAuth();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
  });

  test("logout flow", async () => {
    const { result } = renderHook(() => useAuthStore());

    // Set initial state
    act(() => {
      result.current.setUser({
        id: 1,
        email: "test@test.com",
        role: UserRoles.STUDENT,
      });
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
  });
});
