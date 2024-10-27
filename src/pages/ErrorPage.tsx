import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <>
      <div className="p-5 h-screen flex flex-col items-center justify-center bg-base-100 text-base-content font-body">
        <div className="flex flex-col items-center">
          <h1 className="text-[40px] font-semibold">Uh oh...</h1>
          <p className="">
            {isRouteErrorResponse(error)
              ? "This page does not exist."
              : "Unexpected error"}
          </p>
        </div>
        <button
          className="btn bg-yellow font-medium mt-5 hover:bg-yellow text-darkgrey"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </>
  );
};

export default ErrorPage;
