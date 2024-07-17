import { useNavigate } from "react-router-dom";
import success from "../assets/success.svg";

const SignupSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center text-[#393E46] mx-2">
      <p className="mt-9 mb-9 font-bold text-3xl">Thank you for Signing Up!</p>
      <div className="flex justify-center items-center">
        <img src={success} alt="success" className="w-40 h-40" />
      </div>
      <p className="mt-7 text-2xl font-semibold">You've got mail!</p>
      <p className="w-[47%] mx-auto mt-[45px] font-medium text-[20px]">
        Chech your email for a verification link to verify your account before
        signing in
      </p>
      <button
        onClick={() => navigate("/login")}
        className="btn w-[47%] bg-[#393E46] text-[20px] mt-[65px] text-white border-none"
      >
        Go to Sign In
      </button>
    </div>
  );
};

export default SignupSuccess;
