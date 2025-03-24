import { Link } from "react-router-dom";

const PendingRequest = () => {
  return (
    <Link to="/pending-requests">
      <div className="border-[1px] w-[90%] mr-auto ml-auto border-yellow mt-20 h-[44px] flex items-center">
        <div className="flex gap-[20%] justify-center items-center w-full">
          <div className=" text-[12px] font-bold text-base-content">
            Pending Requests
          </div>
          <div className="w-[30px] h-[30px] bg-yellow rounded-full flex items-center justify-center text-darkgrey font-bold text-[12px]">
            5
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PendingRequest;
