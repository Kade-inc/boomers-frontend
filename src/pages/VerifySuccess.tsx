import { Link } from "react-router-dom";
import success from "../assets/success-svgrepo-com 1.svg";

const VerifySuccess = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute top-0 left-0 m-2">
        <h1 className="text-2xl font-bold">LOGO</h1>
      </div>
      <div className=" flex flex-col items-center justify-center h-full">
        <img
          src={success}
          className="absolute top-[253px] lg:top-[279px] lg:left-[622px] w-[150px] lg:w-[200px] h-[150px] lg:h-[200px] sm:w-1/4 md:w-1/6   object-cover mb-4"
        />
        <p className="absolute top-[445px] lg:top-[518px] lg:left-[608px] w-[222px] h-[44px] lg:w-[225px] lg:h-[48px] text-center font-semibold text-[18px] lg:text-[20px] leading-[21.94px] lg:leading-[24.38px] text-gray-600">
          Your Boomer account is now verified!
        </p>
        <button className="absolute top-[530px] lg:top-[605px] left-[25px] lg:left-[542px] w-[290px] lg:w-[357px] h-[47px] lg:h-[61px] rounded-[5px] bg-gray-800 text-[15px] lg:text-[20px] leading-[24.38px] text-white font-semibold">
          <Link to={"/"}>Go to Sign In</Link>
        </button>
      </div>
    </div>
  );
};

export default VerifySuccess;
