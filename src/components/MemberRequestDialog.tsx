import { useState, useRef, useEffect } from "react";
import UserDetailsCard from "./UserDetailsCard";
import TeamMember from "../entities/TeamMember";
import Request from "../entities/Request";
import useRemoveTeamMember from "../hooks/useRemoveTeamMember";
import useTeams from "../hooks/useTeams";
import React from "react";
import Team from "../entities/Team";
import { useQueryClient } from "@tanstack/react-query";
import useJoinTeamRequest from "../hooks/useJoinTeamRequest";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface MemberRequestDialogProps {
  mode: "request" | "member";
  selectedTeamMember: TeamMember | null;
  selectedRequest: Request | null;
  teamId: string;
}

// carousel
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  initialSlide: 1,

  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
  ],
};

const MemberRequestDialog = ({
  mode,
  selectedTeamMember,
  selectedRequest,
  teamId,
}: MemberRequestDialogProps) => {
  const [selectedMember, setSelectedMember] = useState(false);
  const [acceptClicked, setAcceptClicked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const removeTeamMemberMutation = useRemoveTeamMember();
  const { mutate: joinRequest } = useJoinTeamRequest();
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionStatus, setActionStatus] = useState<
    "accepted" | "rejected" | null
  >(null);
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const resetDialog = () => {
    setSelectedMember(false);
    setIsRemoveLoading(false);
    setAcceptClicked(false);
    setIsAccepting(false);
    setIsRejecting(false);
    setActionStatus(null);
    setShowRejectionInput(false);
    setRejectionReason("");
  };

  // Fetch teams based on the selected request or member
  const activeUserId =
    mode === "member" ? selectedTeamMember?._id : selectedRequest?.user_id;
  // console.log("activeUserId:", activeUserId);
  const {
    data: teams,
    isLoading,
    isError,
  } = useTeams({ userId: activeUserId || "" });

  // console.log("DATA: ", teams);

  //close modal
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_7",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
    resetDialog();
  };

  useEffect(() => {
    if (dialogRef.current && activeUserId) {
      dialogRef.current.showModal();
    }
  }, [activeUserId]);

  if (!selectedTeamMember && mode === "member") return null;

  // Reset state when the dialog is closed
  const handleDialogClose = () => {
    setAcceptClicked(false);
    setSelectedMember(false);
  };

  // Handle Remove Team Member
  const queryClient = useQueryClient();
  const handleRemoveTeamMember = async () => {
    if (selectedTeamMember && teamId) {
      setIsRemoveLoading(true);

      try {
        await removeTeamMemberMutation.mutateAsync(
          { teamId, userId: selectedTeamMember._id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["team", teamId],
              });
              setAcceptClicked(true);
              setShowRejectionInput(false);
            },
          },
        );
      } catch (error) {
        console.error("Error removing team member:", error);
      } finally {
        setIsRemoveLoading(false);
      }
    }
  };

  const handleJoinRequest = (
    status: "APPROVED" | "DECLINED",
    comment: string,
  ) => {
    if (!selectedRequest) return;

    if (status === "APPROVED") setIsAccepting(true);
    if (status === "DECLINED") setIsRejecting(true);

    const payload = { status, comment };

    joinRequest(
      { requestId: selectedRequest._id, payload },
      {
        onSuccess: () => {
          setAcceptClicked(true);
          setShowRejectionInput(false); // Hide rejection input AFTER success
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

  return (
    <dialog
      ref={dialogRef}
      id="my_modal_7"
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
            {mode === "member" ? (
              selectedTeamMember?.profile_picture ? (
                <img
                  className="h-full w-full rounded-full"
                  src={selectedTeamMember.profile_picture}
                  alt="Profile"
                />
              ) : (
                <UserCircleIcon className="h-full w-full text-base-content" />
              )
            ) : selectedRequest?.userProfile?.profile_picture ? (
              <img
                className="h-full w-full rounded-full"
                src={selectedRequest.userProfile.profile_picture}
                alt="Profile"
              />
            ) : (
              <UserCircleIcon className="h-full w-full text-base-content" />
            )}
          </div>

          <h3 className="text-darkgrey mb-5 text-[18px] font-semibold">
            {mode === "member"
              ? selectedTeamMember
                ? `${selectedTeamMember.firstName ?? ""} ${selectedTeamMember.lastName ?? ""}`.trim() ||
                  selectedTeamMember.firstName ||
                  selectedTeamMember.lastName ||
                  selectedTeamMember.username
                : ""
              : selectedRequest?.userProfile
                ? `${selectedRequest.userProfile.firstName ?? ""} ${selectedRequest.userProfile.lastName ?? ""}`.trim() ||
                  selectedRequest.userProfile.firstName ||
                  selectedRequest.userProfile.lastName ||
                  selectedRequest.userProfile.username
                : ""}
          </h3>
        </div>

        {!acceptClicked ? (
          <>
            {!showRejectionInput && (
              <div className="p-4">
                <h3 className="text-[16px] font-semibold mb-2">
                  Current Teams
                </h3>
                {isLoading ? (
                  <div className="flex justify-center">
                    <span className="loading loading-dots loading-xs"></span>
                  </div>
                ) : isError ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : teams && teams.data.length > 0 ? (
                  <div className="slider-container pb-2">
                    <Slider {...settings}>
                      {teams.data.map((team: Team) => (
                        <UserDetailsCard key={team._id} team={team} />
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <p>No teams found.</p>
                )}
                <div>
                  <h3 className="py-2 text-[16px] font-semibold">Interests</h3>
                  <div className="flex items-center mb-2 font-regular text-[14px]">
                    {mode === "member" && selectedTeamMember?.interests ? (
                      <>
                        {selectedTeamMember.interests.domain ||
                        selectedTeamMember.interests.subdomain ||
                        selectedTeamMember.interests.subdomainTopics?.length >
                          0 ? (
                          <>
                            {selectedTeamMember.interests.domain}{" "}
                            {selectedTeamMember.interests.subdomain}{" "}
                            {selectedTeamMember.interests.subdomainTopics?.map(
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
                        )}
                      </>
                    ) : mode === "request" &&
                      selectedRequest?.userProfile.interests ? (
                      <>
                        {selectedRequest.userProfile.interests.domain ||
                        selectedRequest.userProfile.interests.subdomain ||
                        selectedRequest.userProfile.interests.subdomainTopics
                          ?.length > 0 ? (
                          <>
                            {selectedRequest.userProfile.interests.domain}{" "}
                            {selectedRequest.userProfile.interests.subdomain}{" "}
                            {selectedRequest.userProfile.interests.subdomainTopics?.map(
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
                        )}
                      </>
                    ) : (
                      <p>No interests found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {showRejectionInput && (
              <div className="p-10">
                <p className="text-center font-medium text-[16px] mb-4">
                  Kindly give a reason to let{" "}
                  <span>
                    {" "}
                    {mode === "member"
                      ? selectedTeamMember
                        ? `${selectedTeamMember.firstName ?? ""} ${selectedTeamMember.lastName ?? ""}`.trim() ||
                          selectedTeamMember.firstName ||
                          selectedTeamMember.lastName ||
                          selectedTeamMember.username
                        : ""
                      : selectedRequest?.userProfile
                        ? `${selectedRequest.userProfile.firstName ?? ""} ${selectedRequest.userProfile.lastName ?? ""}`.trim() ||
                          selectedRequest.userProfile.firstName ||
                          selectedRequest.userProfile.lastName ||
                          selectedRequest.userProfile.username
                        : ""}
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
              {mode === "member" && !selectedMember ? (
                <div
                  className=" w-full text-white bg-[#C83A3A] rounded-none hover:bg-[#C83A3A] py-4 flex justify-center cursor-pointer"
                  onClick={() => setSelectedMember(true)}
                >
                  Remove Team Member
                </div>
              ) : (
                <>
                  {mode === "request" && (
                    <div className="flex w-full flex-col">
                      {/* Accept or Cancel Button */}
                      {!showRejectionInput ? (
                        <div
                          className={`w-full text-white bg-[#14AC91] py-4 rounded-none hover:bg-[#14AC91] text-center cursor-pointer ${
                            isAccepting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={
                            !isAccepting
                              ? () => {
                                  handleJoinRequest("APPROVED", "Looks good");
                                  setActionStatus("accepted");
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

                      {/* Reject Button */}
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
                                  setActionStatus("rejected");
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

                  {mode === "member" && selectedMember && (
                    <div className="flex w-full">
                      <div
                        className="w-1/2 text-white bg-[#14AC91] rounded-none hover:bg-[#14AC91] flex justify-center py-4 cursor-pointer"
                        onClick={closeModal}
                      >
                        Cancel
                      </div>

                      <div
                        className={`w-1/2 text-white bg-[#C83A3A] rounded-none hover:bg-[#C83A3A] flex justify-center items-center py-4 cursor-pointer ${
                          isRemoveLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={
                          !isRemoveLoading ? handleRemoveTeamMember : undefined
                        } // Prevent multiple clicks
                      >
                        {isRemoveLoading ? (
                          <div className="flex justify-center">
                            <span className="loading loading-dots loading-xs"></span>
                          </div>
                        ) : (
                          "Remove"
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-[16px] text-base-content mb-4">
              {mode === "member"
                ? `${
                    selectedTeamMember
                      ? `${selectedTeamMember.firstName ?? ""} ${selectedTeamMember.lastName ?? ""}`.trim() ||
                        selectedTeamMember.firstName ||
                        selectedTeamMember.lastName ||
                        selectedTeamMember.username
                      : ""
                  } has been removed from the team`
                : mode === "request"
                  ? actionStatus === "accepted"
                    ? `${
                        selectedRequest?.userProfile
                          ? `${selectedRequest.userProfile.firstName ?? ""} ${selectedRequest.userProfile.lastName ?? ""}`.trim() ||
                            selectedRequest.userProfile.firstName ||
                            selectedRequest.userProfile.lastName ||
                            selectedRequest.userProfile.username
                          : ""
                      } has been accepted to the team`
                    : actionStatus === "rejected"
                      ? `${
                          selectedRequest?.userProfile
                            ? `${selectedRequest.userProfile.firstName ?? ""} ${selectedRequest.userProfile.lastName ?? ""}`.trim() ||
                              selectedRequest.userProfile.firstName ||
                              selectedRequest.userProfile.lastName ||
                              selectedRequest.userProfile.username
                            : ""
                        } has been rejected from the team`
                      : `${
                          selectedRequest?.userProfile
                            ? `${selectedRequest.userProfile.firstName ?? ""} ${selectedRequest.userProfile.lastName ?? ""}`.trim() ||
                              selectedRequest.userProfile.firstName ||
                              selectedRequest.userProfile.lastName ||
                              selectedRequest.userProfile.username
                            : ""
                        } has been added to the team`
                  : ""}
            </p>
            ;
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
