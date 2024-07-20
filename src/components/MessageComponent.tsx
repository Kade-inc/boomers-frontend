import { Link } from "react-router-dom";
import Message from "../entities/message";

const MessageComponent = ({ img, message }: Message) => {
  return (
    <div className="relative h-screen flex flex-col">
      <div className="absolute top-0 left-0 m-2">
        <h1 className="text-2xl font-bold">LOGO</h1>
      </div>
      <div className=" flex flex-col items-center justify-center h-full">
        <img
          src={img}
          className="w-[150px] sm:w-1/4 md:w-1/6 lg:w-[200px] h-[150px] sm:h-auto lg:h-[200px]  object-cover mb-6"
        />
        <p className="text-center font-semibold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-gray-600 mb-8">
          {message}
        </p>
        <button className=" w-[290px] sm:w-[320px] md:w-[350px] lg:w-[380px] h-[47px] sm:h-[50px] md:h-[55px] lg:h-[60px] rounded-[5px] bg-gray-800 text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-white font-semibold">
          <Link to={"/"}>Go to Sign In</Link>
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
