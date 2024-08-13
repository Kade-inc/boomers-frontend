import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import SignupSuccess from "../components/SignupSuccess";
import SignupVerificationSuccess from "../pages/SignupVerificationSuccess";
import ForgotPassword from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
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
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
export default router;
