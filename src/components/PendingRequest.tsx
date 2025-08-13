import { Link } from "react-router-dom";
import User from "../entities/User";
import JoinRequest from "../entities/JoinRequest";

interface Props {
  requests: JoinRequest[] | undefined;
  user: User;
  error: Error | null;
}
const PendingRequest = ({ requests, user, error }: Props) => {
  const pendingRequests = (Array.isArray(requests) ? requests : []).filter(
    (req) =>
      req.status === "PENDING" && req.owner_id?.profile?._id === user._id,
  );

  if (error) {
    return (
      <div className="border-[1px] w-[90%] mr-auto ml-auto border-[red] mt-8 py-2 flex justify-center rounded-sm md:bg-transparent">
        <span className="w-3/4 text-center font-body font-medium">
          Error fetching pending requests
        </span>
      </div>
    );
  }
  return (
    <div className="border-[1px] w-[90%] mr-auto ml-auto border-yellow mt-8 py-2 flex items-center justify-between rounded-sm hover:bg-yellow bg-yellow md:bg-transparent">
      <Link to="/pending-requests" className="mx-auto">
        <div className="flex justify-between items-center w-full gap-4">
          <div className="font-body font-semibold text-[14px] xl:text-[15px] text-base-content hover:text-darkgrey">
            Pending Requests{" "}
            <span className="md:hidden">({pendingRequests.length})</span>
          </div>
          <div className="hidden md:flex w-[30px] h-[30px] bg-yellow rounded-full flex items-center justify-center text-darkgrey font-body font-semibold text-[16px] md:text-[14px]">
            {pendingRequests.length}
          </div>
          <button className="md:hidden bg-darkgrey text-white px-4 text-[14px] xl:text-[15px] py-1 rounded-sm font-body font-medium">
            View
          </button>
        </div>
      </Link>
    </div>
  );
};

export default PendingRequest;
