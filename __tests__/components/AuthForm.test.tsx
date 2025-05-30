import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";
import AuthForm from "../../src/components/AuthForm";
import { useAuthStore } from "../../src/store/useAuthStore";
import { authApi } from "../../src/api/auth";
import { UserRoles } from "../../src/models/User";

jest.mock("../../src/store/useAuthStore");
jest.mock("../../src/api/auth");

describe("AuthForm", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      loginAttempts: 0,
      resetLoginAttempts: jest.fn(),
    });
  });

  test("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <AuthForm mode="login">
          {(disableSubmit) => (
            <div data-testid="form-content">
              {disableSubmit ? "disabled" : "enabled"}
            </div>
          )}
        </AuthForm>
      </BrowserRouter>
    );

    expect(screen.getByTestId("form-content")).toBeInTheDocument();
  });

  test("handles failed login attempts", async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      loginAttempts: 5,
      resetLoginAttempts: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AuthForm mode="login">
          {(disableSubmit) => (
            <div data-testid="form-content">
              {disableSubmit ? "disabled" : "enabled"}
            </div>
          )}
        </AuthForm>
      </BrowserRouter>
    );

    expect(
      screen.getByText(/Too many failed login attempts/i)
    ).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    const mockUser = { id: 1, email: "test@test.com", role: UserRoles.STUDENT };
    (authApi.login as jest.Mock).mockResolvedValue({ data: mockUser });
    (authApi.getToken as jest.Mock).mockResolvedValue({ data: mockUser });

    render(
      <BrowserRouter>
        <AuthForm mode="login">
          {(disableSubmit) => (
            <form data-testid="login-form">
              <input type="email" name="email" data-testid="email-input" />
              <input
                type="password"
                name="password"
                data-testid="password-input"
              />
              <button type="submit" disabled={disableSubmit}>
                Login
              </button>
            </form>
          )}
        </AuthForm>
      </BrowserRouter>
    );

    const form = screen.getByTestId("login-form");
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  test("handles login error", async () => {
    const error = new Error("Invalid credentials");
    (authApi.login as jest.Mock).mockRejectedValue(error);

    render(
      <BrowserRouter>
        <AuthForm mode="login">
          {(disableSubmit) => (
            <form data-testid="login-form">
              <input type="email" name="email" data-testid="email-input" />
              <input
                type="password"
                name="password"
                data-testid="password-input"
              />
              <button type="submit" disabled={disableSubmit}>
                Login
              </button>
            </form>
          )}
        </AuthForm>
      </BrowserRouter>
    );

    const form = screen.getByTestId("login-form");
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "wrong-password",
      });
    });
  });
});
