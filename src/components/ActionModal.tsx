import { useState, useRef } from "react";
import React from "react";
import useJoinTeamRequest from "../hooks/useJoinTeamRequest";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import JoinRequest from "../entities/JoinRequest";
import User from "../entities/User";

interface ActionDialogProps {
  selectedPendingMemberAction: JoinRequest | null;
}

const MemberRequestDialog = ({
  selectedPendingMemberAction,
}: ActionDialogProps) => {
  const [acceptClicked, setAcceptClicked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { mutate: joinRequest } = useJoinTeamRequest();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionStatus, setActionStatus] = useState<
    "accepted" | "rejected" | null
  >(null);
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const resetDialog = () => {
    setAcceptClicked(false);
    setIsAccepting(false);
    setIsRejecting(false);
    setActionStatus(null);
    setShowRejectionInput(false);
    setRejectionReason("");
  };

  //close modal
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_9",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
    resetDialog();
  };

  // Reset state when the dialog is closed
  const handleDialogClose = () => {
    setAcceptClicked(false);
  };

  const handleJoinRequest = (
    status: "APPROVED" | "DECLINED",
    comment: string,
  ) => {
    if (!selectedPendingMemberAction) return;

    if (status === "APPROVED") setIsAccepting(true);
    if (status === "DECLINED") setIsRejecting(true);

    const payload = { status, comment };

    joinRequest(
      { requestId: selectedPendingMemberAction._id, payload },
      {
        onSuccess: () => {
          setAcceptClicked(true);
          setShowRejectionInput(false);
          setActionStatus(status === "APPROVED" ? "accepted" : "rejected");
        },
        onError: (error) => {
          console.error("Error handling join request:", error);
        },
        onSettled: () => {
          setIsAccepting(false);
          setIsRejecting(false);
        },
      },
    );
  };

  const getDisplayName = (user: User | undefined) => {
    if (!user) return "Unknown User";

    const { firstName, lastName, username } = user?.profile || {};
    return firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || username || "Unknown User";
  };

  return (
    <dialog
      ref={dialogRef}
      id="my_modal_9"
      className="modal modal-middle font-body"
      onClose={handleDialogClose}
    >
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden !rounded-md"
        style={{ borderRadius: "0px" }}
      >
        <div
          className={`text-center flex flex-col items-center justify-center bg-yellow ${showRejectionInput ? "hidden" : ""}`}
          style={{ opacity: showRejectionInput ? 0 : 1 }}
        >
          <form method="dialog" className="ml-[90%] mt-1">
            <button className="text-darkgrey font-semibold">X</button>
          </form>
          <div className="mb-3 mx-auto mt-5 h-[81px] w-[81px] rounded-full flex items-center justify-center">
            {selectedPendingMemberAction?.user_id.profile_picture ? (
              <img
                src={selectedPendingMemberAction.user_id.profile_picture}
                alt="user_img"
                className="h-full w-full rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-full w-full text-base-content" />
            )}
          </div>

          <h3 className="text-darkgrey mb-5 text-[18px] font-semibold">
            {getDisplayName(selectedPendingMemberAction?.user_id)}
          </h3>
        </div>

        {!acceptClicked ? (
          <>
            {!showRejectionInput && (
              <div className="p-4">
                <h3 className="py-2 text-[16px] font-semibold">Interests</h3>

                <div className="flex items-center mb-2 font-regular text-[14px]">
                  {selectedPendingMemberAction?.user_id?.interests ? (
                    selectedPendingMemberAction?.user_id?.interests.domain ||
                    selectedPendingMemberAction?.user_id?.interests.subdomain ||
                    selectedPendingMemberAction?.user_id?.interests.domainTopics
                      ?.length > 0 ? (
                      <>
                        <p>
                          {
                            selectedPendingMemberAction?.user_id?.interests
                              .domain
                          }
                        </p>
                        <p>
                          {
                            selectedPendingMemberAction?.user_id?.interests
                              .subdomain
                          }
                        </p>

                        {selectedPendingMemberAction?.user_id?.interests.domainTopics?.map(
                          (topic: string, index: number) => (
                            <React.Fragment key={index}>
                              <div className="bg-black rounded-full w-1 h-1 mx-1"></div>
                              <p>{topic}</p>
                            </React.Fragment>
                          ),
                        )}
                      </>
                    ) : (
                      <p>No interests found.</p>
                    )
                  ) : (
                    <p>No interests found.</p>
                  )}
                </div>
              </div>
            )}
            {showRejectionInput && (
              <div className="p-10">
                <p className="text-center font-medium text-[16px] mb-4">
                  Kindly give a reason to let{" "}
                  <span>
                    {" "}
                    {selectedPendingMemberAction?.user_id.profile.firstName &&
                    selectedPendingMemberAction?.user_id.profile.lastName
                      ? `${selectedPendingMemberAction.user_id.profile.firstName} ${selectedPendingMemberAction.user_id.profile.lastName}`
                      : selectedPendingMemberAction?.user_id.profile
                          .firstName ||
                        selectedPendingMemberAction?.user_id.profile.lastName ||
                        selectedPendingMemberAction?.user_id.profile.username ||
                        "Unknown User"}
                  </span>{" "}
                  know why you have rejected their request
                </p>
                <textarea
                  className="w-full h-32 border border-black overflow-auto resize-none"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="modal-action flex flex-col">
              {/* Accept / Cancel / Reject Buttons */}
              {selectedPendingMemberAction && !actionStatus && (
                <div className="flex w-full flex-col">
                  {/* Accept or Cancel */}
                  {!showRejectionInput ? (
                    <div
                      className={`w-full text-white bg-[#14AC91] py-4 rounded-none hover:bg-[#14AC91] text-center cursor-pointer ${
                        isAccepting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={
                        !isAccepting
                          ? () => {
                              handleJoinRequest("APPROVED", "Looks good");
                            }
                          : undefined
                      }
                    >
                      {isAccepting ? (
                        <div className="flex justify-center">
                          <span className="loading loading-dots loading-xs"></span>
                        </div>
                      ) : (
                        "Accept"
                      )}
                    </div>
                  ) : (
                    <div
                      className="w-full text-white bg-[#14AC91] py-4 rounded-none hover:bg-[#14AC91] text-center cursor-pointer"
                      onClick={() => setShowRejectionInput(false)}
                    >
                      Cancel
                    </div>
                  )}

                  {/* Reject or Confirm Remove */}
                  {!showRejectionInput ? (
                    <div
                      className="w-full text-white bg-[#C83A3A] py-4 rounded-none hover:bg-[#C83A3A] text-center cursor-pointer"
                      onClick={() => setShowRejectionInput(true)}
                    >
                      Reject
                    </div>
                  ) : (
                    <div
                      className={`w-full text-white bg-[#C83A3A] py-4 rounded-none hover:bg-[#C83A3A] text-center cursor-pointer ${
                        isRejecting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={
                        !isRejecting
                          ? () => {
                              handleJoinRequest(
                                "DECLINED",
                                rejectionReason || "No reason provided",
                              );
                            }
                          : undefined
                      }
                    >
                      {isRejecting ? (
                        <div className="flex justify-center">
                          <span className="loading loading-dots loading-xs"></span>
                        </div>
                      ) : (
                        "Reject"
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-[16px] text-base-content mb-4">
              {selectedPendingMemberAction?.user_id
                ? `${getDisplayName(selectedPendingMemberAction.user_id)} ${
                    actionStatus === "accepted"
                      ? "has been accepted to the team"
                      : actionStatus === "rejected"
                        ? "has been rejected from the team"
                        : actionStatus === "removed"
                          ? "has been removed from the team"
                          : "has been added to the team"
                  }`
                : ""}
            </p>

            <button
              className="btn w-[150px] text-white bg-red-600 rounded hover:bg-red-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default MemberRequestDialog;
