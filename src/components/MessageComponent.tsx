import { Link } from "react-router-dom";
import Message from "../entities/message";
import logoFull from "../assets/craftyhyve-logo-full.svg";

const MessageComponent = ({ img, message, submessage, height }: Message) => {
  return (
    <div className={`relative ${height || "h-screen"} flex flex-col  pt-20`}>
      <h1 className="flex items-center justify-center ">
        <Link to="/">
          <img src={logoFull} alt="logo" className="w-52" />
        </Link>
      </h1>
      <div className="flex flex-col items-center mt-20 h-full">
        <img
          src={img}
          className="w-[150px] sm:w-1/4 md:w-1/6 lg:w-[200px] h-[150px] sm:h-auto lg:h-[200px]  object-cover mb-6"
        />
        <div className="px-4 w-full md:w-[40%]">
          <p className="text-center font-semibold text-lg md:text-[20px] text-darkgrey mb-8 whitespace-normal font-body">
            {message}
          </p>
          {submessage && (
            <p className="text-center font-medium text-lg md:text-[20px] text-error mb-8 whitespace-normal font-body">
              {submessage}
            </p>
          )}
        </div>
        <button className="btn w-80 bg-darkgrey mb-[3%] text-white border-none rounded-[5px] bg-darkgrey text-[16px] text-white font-body hover:bg-black">
          <Link to={"/auth/login"}>Go to Sign In</Link>
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
