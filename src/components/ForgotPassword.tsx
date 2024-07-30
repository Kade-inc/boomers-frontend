import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import password from "../assets/password-svgrepo-com 1.svg";
import { useState } from "react";
import useForgotPassword from "../hooks/useForgotPassword";
import ResetLinkSent from "./ResetLinkSent";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate(email, {
      onSettled: () => {
        setEmail("");
      },
    });
  };

  if (isSuccess) {
    return <ResetLinkSent />;
  }

  return (
    <>
      <div className="text-[#393E46]">
        <div className="flex justify-center flex-col items-center mt-16">
          <img src={password} />
          <p className="font-bold text-[19px] sm:text-[23px] md:text-[26px] lg:text-[30px] leading-[53px] font-heading">
            Forgot Password?
          </p>
          <p className="py-[2.6%] text-[12px] sm:text-[15px] md:text-[17px] lg:text-[20px] font-semibold font-body">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form className="w-full px-4 py-[2%] md:px-24" onSubmit={handleSubmit}>
          <Toaster
            position="bottom-center"
            reverseOrder={true}
            toastOptions={{
              error: {
                style: {
                  background: "#D92D2D",
                  color: "white",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#D92D2D",
                },
              },
            }}
          />
          <div className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[20px]">
            <div className="mb-[3%] ">
              <label
                className="block  font-bold mb-[1%] font-body"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600 "
                style={{ backgroundColor: "transparent" }}
              />
            </div>

            <button
              className="btn w-full bg-[#393E46]  mb-[3%] text-white border-none disabled:text-gray-500 font-body hover:bg-black my-5 md:text-[17px] lg:text-[20px]"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Sending" : "Reset Password"}
            </button>

            <p className="text-center font-regular text-darkgrey font-body mt-6 ">
              Remember password?
              <Link to="/login">
                <span className="font-bold "> Sign In</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
