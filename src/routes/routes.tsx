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
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<AppLayout />} fallback={<HomePage />} />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute element={<Dashboard />} fallback={<HomePage />} />
        ),
      },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "teams",
        element: <ProtectedRoute element={<TeamsPage />} />,
      },
      {
        path: "profile",
        element: <ProtectedRoute element={<ProfilePage />} />,
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
]);

export default router;
