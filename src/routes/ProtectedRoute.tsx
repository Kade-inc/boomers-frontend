import { ReactNode } from "react";
import useAuthStore from "../stores/useAuthStore";
import HomePage from "../pages/HomePage";

interface ProtectedRouteProps {
  element: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({
  element,
  fallback = <HomePage />,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <>{element}</> : <>{fallback}</>;
};

export default ProtectedRoute;
