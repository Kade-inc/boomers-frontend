import { FaceFrownIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    navigate("/auth/login");
  };

  return (
    <>
      <div className="p-5 h-screen flex flex-col items-center justify-center bg-base-100 text-base-content font-body gap-4">
        <div className="flex flex-col items-center">
          <FaceFrownIcon className="w-20 h-20 text-base-content" />
          <h1 className="text-[40px] font-semibold">Uh oh...</h1>
          <p className="">
            {isRouteErrorResponse(error)
              ? "This page does not exist."
              : "It's not you, it's us. We're sorry for the inconvenience."}
          </p>
        </div>
        {isRouteErrorResponse(error) ? (
          <button
            className="btn bg-yellow font-medium mt-5 hover:bg-yellow text-darkgrey"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              className="btn bg-yellow font-medium hover:bg-yellow text-darkgrey"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <button
              className="btn bg-black font-medium text-white"
              onClick={() => handleLogout()}
            >
              Home
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ErrorPage;
