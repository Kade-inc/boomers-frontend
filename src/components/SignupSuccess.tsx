import { useNavigate } from "react-router-dom";
import success from "../assets/success.svg";
import useSignUpStore from "../stores/store";
import { useEffect } from "react";

const SignupSuccess = () => {
  const navigate = useNavigate();

  const signUpSuccess = useSignUpStore((s) => s.signUpSuccess);
  const setSignUpSuccess = useSignUpStore((s) => s.setSignUpSuccess);

  useEffect(() => {
    if (!signUpSuccess) {
      navigate("/");
    }
  }, [signUpSuccess]);

  return (
    <div className="text-center text-[#393E46] mx-2 mt-[40px]">
      <p className="mt-9 mb-9 font-bold text-3xl font-body">
        Thank you for Signing Up!
      </p>
      <div className="flex justify-center items-center">
        <img src={success} alt="success" className="w-40 h-40" />
      </div>
      <p className="mt-7 text-2xl font-semibold font-body">You've got mail!</p>
      <p className="w-[47%] mx-auto mt-[40px] font-medium text-[18px] font-body">
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
