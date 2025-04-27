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
import CreateChallenge from "../pages/CreateChallenge";
import ChallengePage from "../pages/ChallengePage";
import EditChallengePage from "../pages/EditChallengePage";
import PendingRequestsPage from "../pages/PendingRequestsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<AppLayout />} fallback={<HomePage />} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "teams", element: <TeamsPage /> },
      { path: "teams/:teamId", element: <TeamDetailsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "recommendations", element: <RecommendationsPage /> },
      { path: "create-team", element: <CreateTeam /> },
      { path: "create-challenge", element: <CreateChallenge /> },
      { path: "challenge/:challengeId", element: <ChallengePage /> },
      { path: "edit-challenge/:challengeId", element: <EditChallengePage /> },
      { path: "pending-requests", element: <PendingRequestsPage /> },
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
