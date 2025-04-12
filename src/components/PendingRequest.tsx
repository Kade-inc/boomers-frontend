import { Link } from "react-router-dom";
import useGetJoinRequests from "../hooks/useGetJoinRequests";
import useAuthStore from "../stores/useAuthStore";

const PendingRequest = () => {
  const { data: requests = { data: [] } } = useGetJoinRequests();
  const user = useAuthStore((s) => s.user);

  const pendingRequests = (
    Array.isArray(requests) ? requests : requests?.data || []
  ).filter(
    (req) =>
      req.status === "PENDING" && req.owner_id?.profile?._id === user._id,
  );

  return (
    <Link to="/pending-requests">
      <div className="border-[1px] w-[90%] mr-auto ml-auto border-yellow mt-8 py-2 flex items-center rounded-sm hover:bg-yellow">
        <div className="flex justify-between items-center w-full px-4">
          <div className=" text-[12px] font-bold text-base-content hover:text-darkgrey">
            Pending Requests
          </div>
          <div className="w-[30px] h-[30px] bg-yellow rounded-full flex items-center justify-center text-darkgrey font-bold text-[12px]">
            {pendingRequests.length}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PendingRequest;
