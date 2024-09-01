import { ReactNode, useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import HomePage from "../pages/HomePage";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({
  element,
  fallback = <HomePage />,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{element}</> : <>{fallback}</>;
};

export default ProtectedRoute;
