import { Link } from "react-router-dom";
import success from "../assets/confetti-svgrepo-com 1.jpg";

const ResetPasswordSuccess = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-[#393E46] bg-white h-full px-8">
        <div className="flex flex-col justify-center items-center">
          <h2 className="block font-heading text-[30px] leading-[31.86px] p-0 lg:px-10 lg:text-[50px] lg:leading-[53.1px]">
            <Link to="/">LOGO</Link>
          </h2>
          <p className="text-darkgrey mt-14 font-body font-bold text-[18px] leading-[21.94px] lg:text-[25px] lg:leading-[30.48px]">
            Success!
          </p>
          <img className="py-8" src={success} />
          <p className="text-[14px] leading-[17.07px] lg:text-[18px] lg:leading-[21.94px] font-medium font-body text-center">
            Your password was reset successfully!
          </p>
        </div>

        <form className="w-full px-6 lg:px-60">
          <button
            className="w-full rounded-md lg:mt-6 py-3 text-[14px] leading-[17.07px] lg:text-[20px] lg:leading-[24.38px] font-medium text-darkgrey bg-yellow transition-opacity duration-200"
            type="submit"
          >
            <Link to="/auth/login">Go to Sign In</Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordSuccess;
