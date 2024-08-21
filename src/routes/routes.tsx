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

const isLoggedIn = false
const router = createBrowserRouter([
  { path: "/",
    element: isLoggedIn ? <HomePage /> : <AppLayout />,
    children: [
      {
        index: true,
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: "/teams",
        element: <TeamsPage />
      }
    ]
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
