import { useState, useRef, useEffect } from "react";
import UserDetailsCard from "./UserDetailsCard";
import TeamMember from "../entities/TeamMember";
import Request from "../entities/Request";
import userImg from "../assets/user-image.svg";
import useRemoveTeamMember from "../hooks/useRemoveTeamMember";
import useTeams from "../hooks/useTeams";
import React from "react";
import Team from "../entities/Team";
import { useQueryClient } from "@tanstack/react-query";
import useJoinTeamRequest from "../hooks/useJoinTeamRequest";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

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

  // Fetch teams based on the selected request or member
  const activeUserId =
    mode === "member" ? selectedTeamMember?._id : selectedRequest?.user_id;
  // console.log("activeUserId:", activeUserId);
  const {
    data: teams,
    isLoading,
    isError,
  } = useTeams({ userId: activeUserId || "" });

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
      try {
        await removeTeamMemberMutation.mutateAsync(
          { teamId, userId: selectedTeamMember._id },
          {
            onSuccess: () => {
              // Invalidate the query
              queryClient.invalidateQueries({
                queryKey: ["team", teamId],
              });
              setAcceptClicked(true);
            },
          },
        );
      } catch (error) {
        console.error("Error removing team member:", error);
      }
    }
  };

  // Handle join Request
  const handleJoinRequest = (
    status: "APPROVED" | "DECLINED",
    comment: string,
  ) => {
    if (selectedRequest) {
      const payload = { status, comment };
      joinRequest(
        { requestId: selectedRequest._id, payload },
        {
          onSuccess: () => {
            setAcceptClicked(true);
          },
        },
      );
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="my_modal_7"
      className="modal modal-middle"
      onClose={handleDialogClose}
    >
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden"
        style={{ borderRadius: "0px" }}
      >
        <div className="text-center flex flex-col items-center justify-center bg-yellow">
          <form method="dialog" className="ml-[90%] mt-1">
            <button className="text-white ">X</button>
          </form>
          <img
            className="mb-3 mx-auto mt-5 h-[81px] w-[81px] rounded-full"
            src={
              mode === "member"
                ? (selectedTeamMember?.profile_picture ?? userImg)
                : (selectedRequest?.userProfile?.profile_picture ?? userImg)
            }
            alt="Profile"
          />
          <h3 className="text-white mb-5 text-[18px] font-bold">
            {mode === "member"
              ? selectedTeamMember?.username
              : selectedRequest?.userProfile?.username}
          </h3>
        </div>

        {!acceptClicked ? (
          <>
            <div className="p-4">
              <h3 className="text-[16px] font-bold mb-2">Current Teams</h3>
              {isLoading ? (
                <p>Loading teams...</p>
              ) : isError ? (
                <p>Error loading teams.</p>
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
                <h3 className="py-2 text-[16px] font-bold">Interests</h3>
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

            {/* Modal Action Buttons */}
            <div className="modal-action flex flex-col">
              {mode === "member" && !selectedMember ? (
                <button
                  className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700"
                  type="button"
                  onClick={() => setSelectedMember(true)}
                >
                  Remove Team Member
                </button>
              ) : (
                <>
                  {mode === "request" && (
                    <div className="flex w-full flex-col">
                      <button
                        className="btn w-full text-white bg-green-600 rounded-none hover:bg-green-700"
                        onClick={() =>
                          handleJoinRequest("APPROVED", "Looks good")
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700"
                        onClick={() =>
                          handleJoinRequest("DECLINED", "Declined")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {mode === "member" && selectedMember && (
                    <div className="flex w-full">
                      <form method="dialog" className="w-1/2 !m-0">
                        <button className="btn w-full text-white bg-green-600 rounded-none hover:bg-green-700">
                          Cancel
                        </button>
                      </form>
                      <button
                        className="btn w-1/2 text-white bg-red-600 rounded-none hover:bg-red-700 !m-0"
                        onClick={handleRemoveTeamMember}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-[16px] text-black mb-4">
              {mode === "member"
                ? `${selectedTeamMember?.username} has been removed from the team`
                : "Request has been processed"}
            </p>
            <form method="dialog">
              <button className="btn w-[150px] text-white bg-red-600 rounded-none hover:bg-red-700">
                Close
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default MemberRequestDialog;
