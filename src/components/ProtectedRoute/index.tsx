import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { PATHS } from "../../routes/paths";

const ProtectedRoute: React.FC<{
  allowedRoles: readonly string[];
  children?: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const role = useAuthStore((state) => state.user?.role) || "student";

  if (!allowedRoles.includes(role)) {
    return <Navigate to={PATHS.HOME.link} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
