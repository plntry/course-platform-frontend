import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { PATHS } from "../../routes/paths";

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({
  allowedRoles,
}) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={PATHS.AUTH} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.NOT_FOUND} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
