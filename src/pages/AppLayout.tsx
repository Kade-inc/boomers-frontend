import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

function AppLayout() {
  const { logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth();
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token) navigate("/");
    };

    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [logout, checkAuth]);

  return (
    <>
      <NavigationBar />
      <div className="pt-[60px]">
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
