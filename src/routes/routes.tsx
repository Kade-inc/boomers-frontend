import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "../pages/Layout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import ErrorPage from "../pages/ErrorPage";

// Lazy loaded pages
const SignupForm = lazy(() => import("../components/SignupForm"));
const LoginForm = lazy(() => import("../components/LoginForm"));
const SignupSuccess = lazy(() => import("../components/SignupSuccess"));
const SignupVerificationSuccess = lazy(
  () => import("../pages/SignupVerificationSuccess"),
);
const ForgotPassword = lazy(() => import("../pages/ForgotPasswordPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const TeamsPage = lazy(() => import("../pages/TeamsPage"));
const AppLayout = lazy(() => import("../pages/AppLayout"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const TeamDetailsPage = lazy(() => import("../pages/TeamDetailsPage"));
const ResetPassword = lazy(() => import("../pages/ResetPasswordPage"));
const RecommendationsPage = lazy(() => import("../pages/RecommendationsPage"));
const CreateTeam = lazy(() => import("../pages/CreateTeam"));
const CreateChallenge = lazy(() => import("../pages/CreateChallenge"));
const ChallengePage = lazy(() => import("../pages/ChallengePage"));
const EditChallengePage = lazy(() => import("../pages/EditChallengePage"));
const PendingRequestsPage = lazy(() => import("../pages/PendingRequestsPage"));
const SearchResultsPage = lazy(() => import("../pages/SearchResultsPage"));
const AllSearchResultsPage = lazy(
  () => import("../pages/AllSearchResultsPage"),
);

const loadingDots = (
  <div className="flex justify-center items-center h-screen bg-base-100">
    <span className="loading loading-dots loading-lg"></span>
  </div>
);

const withSuspense = (component: React.ReactNode) => (
  <Suspense fallback={loadingDots}>{component}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute
        element={withSuspense(<AppLayout />)}
        fallback={<HomePage />}
      />
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "dashboard", element: withSuspense(<Dashboard />) },
      { path: "teams", element: withSuspense(<TeamsPage />) },
      { path: "teams/:teamId", element: withSuspense(<TeamDetailsPage />) },
      { path: "profile/:userId?", element: withSuspense(<ProfilePage />) },
      {
        path: "recommendations",
        element: withSuspense(<RecommendationsPage />),
      },
      { path: "create-team", element: withSuspense(<CreateTeam />) },
      { path: "create-challenge", element: withSuspense(<CreateChallenge />) },
      {
        path: "challenge/:challengeId",
        element: withSuspense(<ChallengePage />),
      },
      {
        path: "edit-challenge/:challengeId",
        element: withSuspense(<EditChallengePage />),
      },
      {
        path: "pending-requests",
        element: withSuspense(<PendingRequestsPage />),
      },
      { path: "search", element: withSuspense(<SearchResultsPage />) },
      {
        path: "search/results/teams",
        element: withSuspense(<AllSearchResultsPage />),
      },
      {
        path: "search/results/challenges",
        element: withSuspense(<AllSearchResultsPage />),
      },
      {
        path: "search/results/people",
        element: withSuspense(<AllSearchResultsPage />),
      },
    ],
  },
  {
    path: "/auth",
    element: withSuspense(<Layout />),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(<SignupForm />) },
      { path: "login", element: withSuspense(<LoginForm />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "signup-success", element: withSuspense(<SignupSuccess />) },
    ],
  },
  {
    path: "/reset-password",
    element: withSuspense(<ResetPassword />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup-verification",
    element: withSuspense(<SignupVerificationSuccess />),
    errorElement: <ErrorPage />,
  },
]);

export default router;
