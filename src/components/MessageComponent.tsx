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
        <div className="px-4 w-60">
          <p className="text-center font-semibold text-[24px] text-darkgrey mb-8 whitespace-normal font-body">
            {message}
          </p>
        </div>
        <button className="btn w-80 bg-darkgrey mb-[3%] text-white border-none rounded-[5px] bg-darkgrey text-[16px] text-white font-body hover:bg-black">
          <Link to={"/login"}>Go to Sign In</Link>
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
