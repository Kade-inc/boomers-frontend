import { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Link } from "react-router-dom";
import useGetJoinRequests from "../hooks/useGetJoinRequests";
import useAuthStore from "../stores/useAuthStore";
import ActionModal from "../components/ActionModal";
import JoinRequest from "../entities/JoinRequest";
import RejectedModal from "../components/RejectedModal";
import ApprovalModal from "../components/ApprovalModal";

const PendingRequestsPage = () => {
  const [expandAction, setExpandAction] = useState(true);
  const [expandApproval, setExpandApproval] = useState(true);
  const [expandRequest, setExpandRequest] = useState(true);
  const { data: requests = { data: [] } } = useGetJoinRequests();
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
    (req) => req.status === "PENDING" && req.user_id?.profile._id === user._id,
  );

  // Requests I have sent
  const declinedRequests = (
    Array.isArray(requests) ? requests : requests?.data || []
  ).filter(
    (req) => req.status === "DECLINED" && req.user_id?.profile._id === user._id,
  );

  return (
    <div className=" h-screen bg-base-100 px-10 pt-10 font-body">
      <div className="text-[20px] font-semibold mb-[50px]">
        <p>
          <Link to="/">Dashboard</Link> &gt; Requests
        </p>
      </div>
      <p className="text-[30px] font-medium mb-[40px]">Pending Requests</p>
      <div className="flex gap-8 mb-[30px]">
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
          pendingRequests.map((request) => (
            <div
              key={request._id}
              className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white"
            >
              <p className="font-semibold text-[14px] mb-6">
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
                  className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]"
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
          ))}
      </div>

      <div className="flex gap-8 mb-[30px] ">
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
          sentPendingRequests.map((request) => (
            <div
              key={request._id}
              className="w-[270px] bg-yellow h-[90px] rounded-[3px] pl-3 pt-3"
            >
              <p className="font-semibold text-[14px] mb-7">
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
                      request.owner_id.profile.username ||
                      "Unknown User"}
                </p>
              </div>
            </div>
          ))}
      </div>

      <div className="flex gap-8 mb-[30px]">
        <p className="text-[18px] font-semibold">Rejected Requests</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandRequest(!expandRequest)}
        >
          {expandRequest ? "Collapse" : "Expand"}
          {expandRequest ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
        <button className="bg-red-600 text-white text-[14px] w-[100px] h-[25px] rounded-[3px]">
          Clear
        </button>
      </div>
      <div className="flex gap-6 pb-[50px] flex-wrap">
        {expandRequest &&
          declinedRequests.map((reject) => (
            <div
              key={reject._id}
              className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white"
            >
              <p className="font-semibold text-[14px] mb-6">
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
                      reject.owner_id.profile.username ||
                      "Unknown User"}
                </p>
                <button
                  className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]"
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
          ))}
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
