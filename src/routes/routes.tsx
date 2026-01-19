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
const EditTeam = lazy(() => import("../pages/EditTeam"));
const PendingRequestsPage = lazy(() => import("../pages/PendingRequestsPage"));
const SearchResultsPage = lazy(() => import("../pages/SearchResultsPage"));
const AdminLayout = lazy(() => import("../pages/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const DashboardOverview = lazy(
  () => import("../pages/admin/DashboardOverview"),
);
const DomainsAdminView = lazy(() => import("../pages/admin/DomainsAdminView"));
const Chat = lazy(() => import("../components/Chat"));
const AllSearchResultsPage = lazy(
  () => import("../pages/AllSearchResultsPage"),
);
const ChallengeSolutionPage = lazy(
  () => import("../pages/ChallengeSolutionPage"),
);
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const ChatLayout = lazy(() => import("../pages/ChatLayout"));

const loadingDots = (
  <div className="flex justify-center items-center h-screen bg-base-100">
    <span className="loading loading-dots loading-lg"></span>
  </div>
);

const withSuspense = (component: React.ReactNode) => (
  <Suspense fallback={loadingDots}>{component}</Suspense>
);

const router = createBrowserRouter([
  // HomePage at root, no AppLayout
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
    index: true,
  },
  // Main app layout for all other routes
  {
    path: "/",
    element: withSuspense(<AppLayout />),
    errorElement: <ErrorPage />,
    children: [
      // Public route
      { path: "teams/:teamId", element: withSuspense(<TeamDetailsPage />) },
      {
        path: "challenge/:challengeId",
        element: withSuspense(<ChallengePage />),
      },
      {
        path: "challenge/:challengeId/solution/:solutionId",
        element: withSuspense(<ChallengeSolutionPage />),
      },
      // Protected routes
      {
        index: true,
        element: (
          <ProtectedRoute
            element={withSuspense(<Dashboard />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            element={withSuspense(<Dashboard />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "teams",
        element: (
          <ProtectedRoute
            element={withSuspense(<TeamsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "teams/:teamId/edit",
        element: (
          <ProtectedRoute
            element={withSuspense(<EditTeam />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "profile/:userId?",
        element: (
          <ProtectedRoute
            element={withSuspense(<ProfilePage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "recommendations",
        element: (
          <ProtectedRoute
            element={withSuspense(<RecommendationsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "create-team",
        element: (
          <ProtectedRoute
            element={withSuspense(<CreateTeam />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "create-challenge",
        element: (
          <ProtectedRoute
            element={withSuspense(<CreateChallenge />)}
            fallback={<HomePage />}
          />
        ),
      },

      {
        path: "edit-challenge/:challengeId",
        element: (
          <ProtectedRoute
            element={withSuspense(<EditChallengePage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "pending-requests",
        element: (
          <ProtectedRoute
            element={withSuspense(<PendingRequestsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute
            element={withSuspense(<SearchResultsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "search/results/teams",
        element: (
          <ProtectedRoute
            element={withSuspense(<AllSearchResultsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "search/results/challenges",
        element: (
          <ProtectedRoute
            element={withSuspense(<AllSearchResultsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "search/results/people",
        element: (
          <ProtectedRoute
            element={withSuspense(<AllSearchResultsPage />)}
            fallback={<HomePage />}
          />
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute
            element={withSuspense(<ChatLayout />)}
            fallback={<HomePage />}
          />
        ),
        children: [
          {
            path: ":chatId",
            element: withSuspense(<Chat />),
          },
        ],
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
  {
    path: "/admin",
    element: withSuspense(<AdminLayout />),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AdminLogin />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            element={<AdminDashboard />}
            fallback={<AdminLogin />}
            requireAdmin={true}
          />
        ),
        children: [
          {
            index: true,
            element: <DashboardOverview />,
          },
          {
            path: "teams",
            element: <div>Teams Management</div>,
          },
          {
            path: "challenges",
            element: <div>Challenges Management</div>,
          },
          {
            path: "users",
            element: <div>Users Management</div>,
          },
          {
            path: "domains",
            element: <DomainsAdminView />,
          },
        ],
      },
    ],
  },
]);

export default router;
