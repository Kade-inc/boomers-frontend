import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import VerifySuccess from "../pages/VerifySuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/verification",
    element: <VerifySuccess />,
  },
]);

export default router;
