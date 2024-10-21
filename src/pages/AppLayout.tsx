import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

function AppLayout() {
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("jwt");
      if (!token && isAuthenticated) {
        // If no token in cookies and user is authenticated, log them out
        logout();
      }
    };

    // Run checkToken on component mount and whenever the component updates
    checkToken();

    // Optional: Add an interval to check the cookie every few seconds
    const interval = setInterval(() => {
      checkToken();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [isAuthenticated, logout]);

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
