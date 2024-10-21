import { ReactNode } from "react";
import useAuthStore from "../stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  element?: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({
  element,
  fallback = <Navigate to="/" replace />,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return fallback;
  }

  return element ? <>{element}</> : <Outlet />;
};

export default ProtectedRoute;
