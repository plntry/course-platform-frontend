import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router";
import "@testing-library/jest-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useAuthStore } from "../../src/store/useAuthStore";
import { UserRoles, GUEST_ROLE } from "../../src/models/User";

jest.mock("../../src/store/useAuthStore");

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("allows access for authorized role", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { role: UserRoles.STUDENT },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute allowedRoles={[UserRoles.STUDENT]}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("redirects for unauthorized role", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { role: UserRoles.STUDENT },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute allowedRoles={[UserRoles.TEACHER]}>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("handles guest role", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute allowedRoles={[GUEST_ROLE]}>
                <div>Guest Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  test("handles multiple allowed roles", () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { role: UserRoles.TEACHER },
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[UserRoles.TEACHER, UserRoles.ADMIN]}
              >
                <div>Teacher or Admin Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText("Teacher or Admin Content")).toBeInTheDocument();
  });
});
