import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import SignupSuccess from "../components/SignupSuccess";
import HomePage from "../pages/HomePage";
import VerifySuccess from "../pages/VerifySuccess";

const router = createBrowserRouter([
  { path: "/home", element: <HomePage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <SignupForm /> },
      { path: "login", element: <LoginForm /> },
      { path: "signup-success", element: <SignupSuccess /> },
    ],
  },
  {
    path: "/verification",
    element: <VerifySuccess />,
  },
]);
export default router;
