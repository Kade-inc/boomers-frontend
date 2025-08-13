import { Link } from "react-router-dom";
import mail from "../assets/mail-svgrepo-com 1.svg";

const ForgotPasswordSuccess = () => {
  return (
    <>
      <div className="text-[#393E46]">
        <div className="flex justify-center flex-col items-center mt-16">
          <p className="font-bold text-[20px] sm:text-[23px] md:text-[26px] lg:text-[30px] font-body mb-8 mt-14">
            Check your email.
          </p>
          <img src={mail} />
          <p className="py-[2.6%] w-[261px] md:w-full lg:w-full text-[16px] sm:text-[15px] md:text-[17px] lg:text-[20px]  font-semibold font-body mt-8 text-wrap text-center">
            A password reset link has been sent to your email.
          </p>
        </div>

        <form className="w-full px-4 md:px-24">
          <button
            className="btn w-full bg-[#393E46] text-[17px]  mb-[3%] text-white border-none disabled:text-gray-500 font-body hover:bg-black my-5"
            type="submit"
          >
            <Link to="/auth/login">Go to Sign In</Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordSuccess;
