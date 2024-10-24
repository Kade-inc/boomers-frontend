import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

function AppLayout() {
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth();
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token && isAuthenticated) {
        logout();
        navigate("/");
      }
    };

    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [isAuthenticated, logout, checkAuth]);

  return (
    <>
      <NavigationBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
