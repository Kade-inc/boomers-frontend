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
import TeamDetailsPage from "../pages/TeamDetailsPage";
import ResetPassword from "../pages/ResetPasswordPage";
import RecommendationsPage from "../pages/RecommendationsPage";
import ErrorPage from "../pages/ErrorPage";
import CreateTeam from "../pages/CreateTeam";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<AppLayout />} fallback={<HomePage />} />,
    errorElement: <ErrorPage />,
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
        path: "teams/:teamId",
        element: <ProtectedRoute element={<TeamDetailsPage />} />,
      },
      {
        path: "/profile",
        element: <ProtectedRoute element={<ProfilePage />} />,
      },
      {
        path: "/recommendations",
        element: <ProtectedRoute element={<RecommendationsPage />} />,
      },
      {
        path: "/create-team",
        element: <ProtectedRoute element={<CreateTeam />} />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SignupForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "signup-success", element: <SignupSuccess /> },
    ],
  },
  {
    path: "/reset-password",
    errorElement: <ErrorPage />,
    element: <ResetPassword />,
  },
  {
    path: "/signup-verification",
    errorElement: <ErrorPage />,
    element: <SignupVerificationSuccess />,
  },
]);

export default router;
