import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

interface ProtectedRouteProps {
  element: React.ReactNode;
  fallback: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  element,
  fallback,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requireAdmin && user?.role !== "superadmin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
