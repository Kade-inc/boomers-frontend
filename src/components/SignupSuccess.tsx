/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from "react-router-dom";
import success from "../assets/success.svg";
import useSignUpStore from "../stores/signUpStore";
import { useEffect } from "react";

const SignupSuccess = () => {
  const navigate = useNavigate();

  const signUpSuccess = useSignUpStore((s) => s.signUpSuccess);
  const setSignUpSuccess = useSignUpStore((s) => s.setSignUpSuccess);

  useEffect(() => {
    if (!signUpSuccess) {
      navigate("/auth");
    }
  }, [signUpSuccess]);

  if (!signUpSuccess) {
    return <></>;
  }

  return (
    <div className="text-darkgrey flex flex-col items-center min-h-screen justify-center">
      <p className="mt-9 mb-9 font-bold text-2xl md:text-3xl font-body">
        Thank you for Signing Up!
      </p>
      <div className="flex justify-center items-center">
        <img src={success} alt="success" className="w-40 h-40" />
      </div>
      <p className="mt-7 text-2xl font-semibold font-body">You've got mail!</p>
      <p className="md:w-[47%] mx-auto mt-[40px] font-medium text-[18px] font-body text-center">
        Check your email for a verification link to verify your account before
        signing in.
      </p>
      <button
        onClick={() => {
          navigate("/auth/login");
          setSignUpSuccess(false);
        }}
        className="btn w-[47%] bg-darkgrey mb-[3%] text-white border-none text-[17px] font-body hover:bg-black mt-[40px]"
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default SignupSuccess;
