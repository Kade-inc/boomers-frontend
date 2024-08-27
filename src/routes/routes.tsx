import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import SignupSuccess from "../components/SignupSuccess";
import SignupVerificationSuccess from "../pages/SignupVerificationSuccess";
import ForgotPassword from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import TeamsPage from "../pages/TeamsPage";
import AppLayout from "../pages/AppLayout";
import ProfilePage from "../pages/ProfilePage";
import UseSignUpStore from "../stores/store";
import React from "react";

// Check authentication
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, checkAuth } = UseSignUpStore();
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isAuthenticated ? element : <HomePage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "/teams",
        element: <ProtectedRoute element={<TeamsPage />} />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Layout />,
    children: [
      { index: true, element: <SignupForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "signup-success", element: <SignupSuccess /> },
    ],
  },
  {
    path: "/signup-verification",
    element: <SignupVerificationSuccess />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute element={<ProfilePage />} />,
  },
]);

export default router;
