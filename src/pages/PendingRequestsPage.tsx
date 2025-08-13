import { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Link } from "react-router-dom";
import useGetJoinRequests from "../hooks/useGetJoinRequests";
import useAuthStore from "../stores/useAuthStore";
import JoinRequest from "../entities/JoinRequest";
import ActionModal from "../components/Modals/ActionModal";
import ApprovalModal from "../components/Modals/ApprovalModal";
import RejectedModal from "../components/Modals/RejectedModal";
import { CiCircleQuestion } from "react-icons/ci";

const PendingRequestsPage = () => {
  const [expandAction, setExpandAction] = useState(true);
  const [expandApproval, setExpandApproval] = useState(true);
  const [expandRequest, setExpandRequest] = useState(true);
  const {
    data: requests = { data: [] },
    isPending,
    isError,
  } = useGetJoinRequests();
  const [selectedPendingMemberAction, setSelectedPendingMemberAction] =
    useState<JoinRequest | null>(null);
  const [selectedRejectRequest, setSelectedRejectRequest] =
    useState<JoinRequest | null>(null);
  const [selectedPendingMemberApproval, setSelectedPendingMemberApproval] =
    useState<JoinRequest | null>(null);
  const user = useAuthStore((s) => s.user);
  // Add a state to track the mode
  const [approvalModalMode, setApprovalModalMode] = useState<
    "action" | "approval"
  >("action");

  const pendingRequests = (
    Array.isArray(requests) ? requests : requests?.data || []
  ).filter(
    (req) =>
      req.status === "PENDING" && req.owner_id?.profile?._id === user._id,
  );

  // Requests I have sent
  const sentPendingRequests = (
    Array.isArray(requests) ? requests : requests?.data || []
  ).filter(
    (req) => req.status === "PENDING" && req.user_id?.profile?._id === user._id,
  );

  // Requests I have sent
  const declinedRequests = (
    Array.isArray(requests) ? requests : requests?.data || []
  ).filter(
    (req) =>
      req.status === "DECLINED" && req.user_id?.profile?._id === user._id,
  );

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100 font-body text-base-content">
        <p>Error Fetching requests.</p>
      </div>
    );
  }
  return (
    <div className=" h-screen bg-base-100 px-10 pt-10 font-body">
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <Link to="/" className="hover:text-underline">
              Dashboard
            </Link>
          </li>
          <li>Recommendations</li>
        </ul>
      </div>
      <p className="text-[30px] font-semibold mb-[30px] mt-4">
        Pending Requests
      </p>
      <div className="flex gap-8 mb-[30px] justify-between md:justify-start">
        <p className="text-[18px] font-semibold">Pending your action</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandAction(!expandAction)}
        >
          {expandAction ? "Collapse" : "Expand"}
          {expandAction ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
      </div>
      <div className="flex gap-6 mb-[50px] flex-wrap">
        {expandAction &&
          (pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div
                key={request._id}
                className={`w-full md:w-[270px] h-[100px] rounded-[3px] pl-3 pt-3 text-white`}
                style={{ background: request.team_id?.teamColor }}
              >
                <p className="font-semibold text-[14px] mb-8">
                  {request.team_id?.name || "Unknown Team"}
                </p>
                <div className="text-[12px] font-medium flex justify-between pr-3">
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      const modal = document.getElementById(
                        "my_modal_17",
                      ) as HTMLDialogElement | null;
                      if (modal) {
                        modal.showModal();
                      }
                      setSelectedPendingMemberApproval(request);
                      setApprovalModalMode("action");
                    }}
                  >
                    {request.user_id?.profile?.firstName &&
                    request.user_id?.profile?.lastName
                      ? `${request.user_id.profile.firstName} ${request.user_id.profile.lastName}`
                      : request.user_id?.profile?.firstName ||
                        request.user_id?.profile?.lastName ||
                        request.user_id?.username ||
                        "Unknown User"}
                  </p>

                  <button
                    className="bg-yellow text-darkgrey w-[62px] h-[25px] rounded-[3px]"
                    onClick={() => {
                      const modal = document.getElementById(
                        "my_modal_9",
                      ) as HTMLDialogElement | null;
                      if (modal) {
                        modal.showModal();
                      }
                      setSelectedPendingMemberAction(request);
                    }}
                  >
                    Action
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center mt-2 w-full">
              <CiCircleQuestion className="w-10 h-10" />
              <p className="my-6 font-body">No pending requests.</p>
            </div>
          ))}
      </div>

      <div className="flex gap-8 mb-[30px] justify-between md:justify-start ">
        <p className="text-[18px] font-semibold">Pending approvals</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandApproval(!expandApproval)}
        >
          {expandApproval ? "Collapse" : "Expand"}
          {expandApproval ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
      </div>
      <div className="flex gap-6 text-white mb-[50px] flex-wrap">
        {expandApproval &&
          (sentPendingRequests && sentPendingRequests.length > 0 ? (
            sentPendingRequests.map((request) => (
              <div
                key={request._id}
                className="w-full md:w-[270px] bg-yellow h-[100px] rounded-[3px] pl-3 pt-3"
                style={{ background: request.team_id?.teamColor }}
              >
                <p className="font-semibold text-[14px] mb-10">
                  {" "}
                  {request.team_id?.name || "Unknown Team"}{" "}
                </p>
                <div className="text-[12px] font-medium flex gap-28">
                  <p
                    className="pr-3 text-right w-full cursor-pointer"
                    onClick={() => {
                      const modal = document.getElementById(
                        "my_modal_17",
                      ) as HTMLDialogElement | null;
                      if (modal) {
                        modal.showModal();
                      }
                      setSelectedPendingMemberApproval(request);
                      setApprovalModalMode("approval");
                    }}
                  >
                    {" "}
                    {request.owner_id.profile?.firstName &&
                    request.owner_id.profile?.lastName
                      ? `${request.owner_id.profile?.firstName} ${request.owner_id.profile.lastName}`
                      : request.owner_id.profile?.firstName ||
                        request.owner_id.profile?.lastName ||
                        request.owner_id.profile?.username ||
                        "Unknown User"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center mt-2 w-full">
              <CiCircleQuestion className="w-10 h-10 text-base-content" />
              <p className="my-6 font-body text-base-content">
                No pending approvals.
              </p>
            </div>
          ))}
      </div>

      <div className="flex gap-8 mb-[30px] justify-between items-center md:justify-start">
        <p className="text-[18px] font-semibold w-2/6 md:w-auto">
          Rejected Requests
        </p>
        <div
          className="border-[1px] border-yellow flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer w-2/6 md:w-[100px] py-1"
          onClick={() => setExpandRequest(!expandRequest)}
        >
          {expandRequest ? "Collapse" : "Expand"}
          {expandRequest ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
        {/* {declinedRequests.length > 0 && (
          <button className="bg-red-600 text-white text-[14px] px-4 py-1 rounded-[3px] ">
            Clear
          </button>
        )} */}
      </div>
      <div className="flex gap-6 pb-[50px] flex-wrap">
        {expandRequest && declinedRequests.length > 0 ? (
          declinedRequests.map((reject) => (
            <div
              key={reject._id}
              className="w-full md:w-[270px] bg-[#D9436D] h-[100px] rounded-[3px] pl-3 pt-3 text-white"
              style={{ background: reject.team_id?.teamColor }}
            >
              <p className="font-semibold text-[14px] mb-8">
                {" "}
                {reject.team_id?.name || "Unknown Team"}{" "}
              </p>
              <div className="text-[12px] font-medium flex justify-between pr-3">
                <p>
                  {" "}
                  {reject.owner_id.profile?.firstName &&
                  reject.owner_id.profile?.lastName
                    ? `${reject.owner_id.profile?.firstName} ${reject.owner_id.profile.lastName}`
                    : reject.owner_id.profile?.firstName ||
                      reject.owner_id.profile?.lastName ||
                      reject.owner_id.profile?.username ||
                      "Unknown User"}
                </p>
                <button
                  className="bg-yellow text-darkgrey w-[62px] h-[25px] rounded-[3px]"
                  onClick={() => {
                    const modal = document.getElementById(
                      "my_modal_15",
                    ) as HTMLDialogElement | null;
                    if (modal) {
                      modal.showModal();
                    }
                    setSelectedRejectRequest(reject);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center mt-2 w-full">
            <CiCircleQuestion className="w-10 h-10 text-base-content" />
            <p className="my-6 font-body text-base-content">
              No rejected requests.
            </p>
          </div>
        )}
      </div>
      <ActionModal selectedPendingMemberAction={selectedPendingMemberAction} />
      <RejectedModal selectedRejectRequest={selectedRejectRequest} />
      <ApprovalModal
        selectedPendingMemberApproval={selectedPendingMemberApproval}
        mode={approvalModalMode}
      />
    </div>
  );
};

export default PendingRequestsPage;
