import { Link, useLocation } from "react-router-dom";
import success from "../assets/success-svgrepo-com 1.svg";
import useVerifyUser from "../hooks/useVerifyUser";
import alert from "../assets/alert-cirlcle-error-svgrepo-com 1.svg";

const VerifySuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email");
  const verificationCodeParam = params.get("verificationCode");

  const { data, error, isLoading } = useVerifyUser(
    emailParam!,
    verificationCodeParam!
  );

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center h-screen">
        <span className="loading loading-ball loading-xs"></span>
        <span className="loading loading-ball loading-sm"></span>
        <span className="loading loading-ball loading-md"></span>
        <span className="loading loading-ball loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen flex flex-col">
        <div className="absolute top-0 left-0 m-2">
          <h1 className="text-2xl font-bold">LOGO</h1>
        </div>
        <div className=" flex flex-col items-center justify-center h-full">
          <img
            src={alert}
            className="w-[150px] sm:w-1/4 md:w-1/6 lg:w-[200px] h-[150px] sm:h-auto lg:h-[200px]  object-cover mb-6"
          />
          <p className=" text-center font-semibold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-gray-600 mb-8">
            Code already used.
          </p>
          <button className=" w-[290px] sm:w-[320px] md:w-[350px] lg:w-[380px] h-[47px] sm:h-[50px] md:h-[55px] lg:h-[60px] rounded-[5px] bg-gray-800 text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-white font-semibold">
            <Link to={"/"}>Go to Sign In</Link>
          </button>
        </div>
      </div>
    );
  }

  if (data && data.successful) {
    return (
      <div className="relative h-screen flex flex-col">
        <div className="absolute top-0 left-0 m-2">
          <h1 className="text-2xl font-bold">LOGO</h1>
        </div>
        <div className=" flex flex-col items-center justify-center h-full">
          <img
            src={success}
            className="w-[150px] lg:w-[200px] h-[150px] lg:h-[200px] sm:w-1/4 md:w-1/6 object-cover mb-6"
          />
          <p className=" w-[222px] h-[44px] lg:w-[225px] lg:h-[48px] text-center font-semibold text-[18px] lg:text-[20px] leading-[21.94px] lg:leading-[24.38px] text-gray-600 mb-8">
            Your Boomer account is now verified!
          </p>
          <button className=" w-[290px] lg:w-[357px] h-[47px] lg:h-[61px] rounded-[5px] bg-gray-800 text-[15px] lg:text-[20px] leading-[24.38px] text-white font-semibold">
            <Link to={"/"}>Go to Sign In</Link>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-screen flex flex-col">
      <div className="absolute top-0 left-0 m-2">
        <h1 className="text-2xl font-bold">LOGO</h1>
      </div>
      <div className=" flex flex-col items-center justify-center h-full">
        <img
          src={alert}
          className="w-[150px] lg:w-[200px] h-[150px] lg:h-[200px] sm:w-1/4 md:w-1/6 object-cover mb-6"
        />
        <p className="text-center font-semibold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-gray-600 mb-8">
          Verification code not found.
        </p>
        <button className="rounded-[5px] bg-gray-800 text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-white font-semibold">
          <Link to={"/"}>Go to Sign In</Link>
        </button>
      </div>
    </div>
  );
};

export default VerifySuccess;
