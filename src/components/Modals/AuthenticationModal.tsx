import { FaHiking } from "react-icons/fa";
import Team from "../../entities/Team";
import { useNavigate } from "react-router-dom";

type ModalTriggerProps = {
  team: Team;
};

const AuthenticationModal = ({ team }: ModalTriggerProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate(`/auth?${team._id}`);
  };

  const handleSignIn = () => {
    navigate(`/auth/login?${team._id}`);
  };
  return (
    <>
      <dialog
        id="authentication_modal"
        className="modal fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex justify-center items-center overflow-scroll font-body"
      >
        <div className="flex flex-col h-[50vh] relative bg-base-100 w-[400px] rounded-sm px-4 text-center">
          <form method="dialog" className="ml-[90%] mt-1">
            <button
              className="rounded-full flex self-end mb-2 absolute top-4 right-6 font-bold text-xl text"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#D92D2D"
                className="size-6 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
          <div className="flex justify-center flex-col items-center h-full gap-4">
            <FaHiking size={100} className="text-[base-content]" />
            <p className="font-medium">
              You need to sign up first to join{" "}
              <span className="font-bold text-teal-500">{team.name}</span>
            </p>
            <button
              className="btn bg-yellow w-full text-base-content"
              onClick={handleSignUp}
            >
              Sign up
            </button>
            <p className="text-base-content">
              Already have an account?{" "}
              <span
                className="text-teal-500 cursor-pointer font-semibold"
                onClick={handleSignIn}
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default AuthenticationModal;
