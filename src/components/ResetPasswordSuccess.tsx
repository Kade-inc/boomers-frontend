import { Link } from "react-router-dom";
import success from "../assets/confetti-svgrepo-com 1.jpg";

const ResetPasswordSuccess = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-[#393E46] bg-white h-full">
        <div className="flex flex-col justify-center items-center mt-40 mb-4 lg:mt-14 lg:mb-4">
          <h2 className="block font-heading text-[30px] leading-[31.86px] p-0 lg:p-10 lg:text-[50px] lg:leading-[53.1px]">
            <Link to="/">LOGO</Link>
          </h2>
          <p className="text-darkgrey mt-12 md:mt-14 lg:mt-16 font-body font-bold text-[18px] leading-[21.94px] lg:text-[25px] lg:leading-[30.48px]">
            Success!
          </p>
          <img className="py-10 w-1/3 md:w-2/3 lg:w-4/12 mt-2" src={success} />
          <p className="text-[14px] text-nowrap leading-[17.07px] lg:text-[18px] lg:leading-[21.94px] font-medium font-body text-center py-2 lg:py-2">
            Your password was reset successfully!
          </p>
        </div>

        <form className="flex w-full justify-center items-center">
          <button
            className="w-3/4 md:w-2/4 lg:w-1/3 rounded-md mt-3 py-3 px-2 md:py-3 lg:py-3 text-[14px] lg:text-[20px] leading-[17.07px] lg:leading-[24.38px] font-medium text-darkgrey bg-yellow transform transition-opacity duration-200"
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
