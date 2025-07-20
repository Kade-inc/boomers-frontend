import { useState } from "react";
import ChallengesCard from "../components/ChallengesCard";
import MemberCard from "../components/MemberCard";
import { useNavigate, useParams } from "react-router-dom";
import TeamMember from "../entities/TeamMember";
import useTeam from "../hooks/useTeam";
import useTeamChallenges from "../hooks/Challenges/useTeamChallenges";
import useTeamMemberRequests from "../hooks/useTeamMemberRequests";
import { Toaster } from "react-hot-toast";
import Challenge from "../entities/Challenge";
import Request from "../entities/Request";
import useAuthStore from "../stores/useAuthStore";
import AddMemberDialog from "../components/Modals/AddMemberDialog";
import LeaveTeamDialog from "../components/Modals/LeaveTeamDialog";
import MemberRequestDialog from "../components/Modals/MemberRequestDialog";
import React from "react";
import useSendTeamRequest from "../hooks/useSendTeamRequest";
import useDeleteChallenges from "../hooks/Challenges/useDeleteChallenges";
import { FaceFrownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GrTest } from "react-icons/gr";
import TeamOwnerDialog from "../components/Modals/TeamOwnerDialog";
import AuthenticationModal from "../components/Modals/AuthenticationModal";

const TeamDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { teamId } = useParams<{ teamId: string }>();
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<TeamMember | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const {
    mutate: sendRequest,
    isPending,
    isError: sendRequestError,
  } = useSendTeamRequest();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "drafts" | "completed">("all");
  const [dialogMode, setDialogMode] = useState<"request" | "member">("request");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  // Function to open the dialog
  const openMemberDialog = (mode: "request" | "member") => {
    setDialogMode(mode);
    const modal = document.getElementById(
      "my_modal_7",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const openTeamOwnerDialog = () => {
    const modal = document.getElementById(
      "team_owner_modal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const openAuthenticationDialog = () => {
    const modal = document.getElementById(
      "authentication_modal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  //user
  const { user, isAuthenticated } = useAuthStore.getState();

  const { mutate: deleteChallenges, isPending: isDeleting } =
    useDeleteChallenges();

  // Delete selected challenges
  const handleDeleteDrafts = () => {
    if (isDeleteMode && selectedChallenges.length > 0) {
      deleteChallenges(
        { challengeIds: selectedChallenges },
        {
          onSuccess: () => {
            setIsDeleteMode(false);
            setSelectedChallenges([]);
          },
        },
      );
    } else {
      setIsDeleteMode(true);
    }
  };

  const handleCancel = () => {
    setIsDeleteMode(false);
    setSelectedChallenges([]);
  };

  const {
    data: team,
    isPending: isTeamPending,
    error: teamError,
  } = useTeam(teamId || "");
  const { data: challenges, isPending: isChallengesPending } =
    useTeamChallenges(teamId || "", isAuthenticated);
  const { data: requests, isPending: isTeamMemberRequestsPending } =
    useTeamMemberRequests(teamId || "", isAuthenticated);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const owner = user.user_id === team?.members[0]?._id;
  // find user in requests
  const userRequest = requests?.find(
    (request: Request) =>
      request.user_id === user.user_id && request.status === "PENDING",
  );

  const firstName = team?.members[0]?.firstName;
  const lastName = team?.members[0]?.lastName;
  const username = team?.members[0]?.username;

  // Determine what to display
  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || username;

  const handleRequestClick = () => {
    if (!teamId) {
      console.error("teamId is undefined");
      return;
    }

    if (!isAuthenticated) {
      openAuthenticationDialog();
      return;
    }

    sendRequest(
      { payload: { team_id: teamId, user_id: user.user_id } },
      {
        onSuccess: () => {
          setIsClicked(true);
          //invalidate
        },
        onError: (error) => {
          console.error("Request failed:", error);
        },
      },
    );
  };

  if (
    isTeamPending ||
    (isChallengesPending && isAuthenticated) ||
    (isTeamMemberRequestsPending && isAuthenticated)
  ) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg text-base-content"></span>
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-base-100">
        <FaceFrownIcon className="w-20 h-20 text-base-content" />
        <p className="font-body text-base-content text-center">
          Error loading page. Please try again later.
        </p>
        <button
          className="btn bg-yellow font-medium mt-5 hover:bg-yellow text-darkgrey font-body"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    );
  }

  // Function to get filtered challenges
  const getFilteredChallenges = () => {
    if (!challenges) return [];

    const isOwner = user.user_id === team?.members[0]?._id;
    const isMember = team?.members?.some(
      (member: TeamMember) => member._id === user.user_id,
    );
    const isNonMember = !isOwner && !isMember;

    if (isNonMember) {
      return challenges.filter(
        (challenge: Challenge) => challenge.valid === true,
      ); // Only completed for non-members
    }

    // Members and owner can filter normally
    switch (filter) {
      case "drafts":
        return challenges.filter(
          (challenge: Challenge) => challenge.valid === false,
        );
      case "completed":
        return challenges.filter(
          (challenge: Challenge) => challenge.valid === true,
        );
      default:
        return challenges;
    }
  };

  const filteredChallenges = getFilteredChallenges();

  return (
    <div className="h-screen bg-base-100 py-[8px] px-[8px] sm:py-10 sm:px-[40px]">
      <>
        <Toaster
          position="bottom-center"
          reverseOrder={true}
          toastOptions={{
            error: {
              style: {
                background: "#D92D2D",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#D92D2D",
              },
            },
          }}
        />
        {/* {teamError && (
          <Toaster
            position="bottom-center"
            reverseOrder={true}
            toastOptions={{
              error: {
                style: {
                  background: "#D92D2D",
                  color: "white",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#D92D2D",
                },
              },
            }}
          />
        )}
        {challengesError && (
          <Toaster
            position="bottom-center"
            reverseOrder={true}
            toastOptions={{
              error: {
                style: {
                  background: "#D92D2D",
                  color: "white",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#D92D2D",
                },
              },
            }}
          />
        )}
        {teamMemberRequestsError && (
          <Toaster
            position="bottom-center"
            reverseOrder={true}
            toastOptions={{
              error: {
                style: {
                  background: "#D92D2D",
                  color: "white",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#D92D2D",
                },
              },
            }}
          />
        )} */}
        {team && (
          <>
            <div
              className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white p-0 w-full h-[200px] rounded-[3px] font-body"
              style={{ background: team?.teamColor }}
            >
              <div className="card-body px-2 md:px-6">
                <div className="flex justify-between w-full items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <h2 className="font-bold text-[20px] ">{team?.name}</h2>
                      {owner && (
                        <button
                          className="text-darkgrey text-[14px] bg-white font-body font-medium rounded px-4 py-1"
                          onClick={() => navigate(`/teams/${teamId}/edit`)}
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    <p className="mb-3 text-[18px] font-medium">
                      Specialization
                    </p>

                    <div className="flex items-center mb-2 font-regular flex-wrap text-[14px]">
                      {team.domain}{" "}
                      <div className="bg-white rounded-full w-1 h-1 mx-1"></div>{" "}
                      {team.subdomain}{" "}
                      {team.subdomainTopics.map(
                        (topic: string, index: number) => (
                          <React.Fragment key={index}>
                            <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                            <p>{topic}</p>
                          </React.Fragment>
                        ),
                      )}
                    </div>
                  </div>
                  <div
                    className="text-center flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(`/profile/${team?.members[0]?._id}`);
                      } else {
                        openTeamOwnerDialog();
                      }
                    }}
                  >
                    {team?.members[0]?.profile_picture ? (
                      <img
                        className="mb-3 mx-auto w-[60px] h-[60px] sm:w-[81px] sm:h-[81px] rounded-full"
                        src={team.members[0].profile_picture}
                        alt="Profile"
                      />
                    ) : (
                      <UserCircleIcon className="mb-3 mx-auto w-[60px] h-[60px] sm:w-[81px] sm:h-[81px] text-white" />
                    )}
                    <p>{displayName}</p>
                    <p className="text-center text-[12px]">Owner</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              role="tablist"
              className="tabs tabs-bordered max-w-md ml-0 mt-4"
            >
              <button
                role="tab"
                className={`tab font-body border-b-2 ${
                  activeTab === "members" ? "border-b-4" : "border-transparent"
                }`}
                style={{
                  borderColor:
                    activeTab === "members"
                      ? "rgba(248, 181, 0, 1)"
                      : "transparent",
                }}
                onClick={() => handleTabClick("members")}
              >
                Members
              </button>

              {isAuthenticated && (
                <button
                  role="tab"
                  className={`tab font-body border-b-2 ${
                    activeTab === "challenges"
                      ? "border-b-4"
                      : "border-transparent"
                  }`}
                  style={{
                    borderColor:
                      activeTab === "challenges"
                        ? "rgba(248, 181, 0, 1)"
                        : "transparent",
                  }}
                  onClick={() => handleTabClick("challenges")}
                >
                  Challenges
                </button>
              )}

              {user?.user_id === team?.members[0]?._id && (
                <button
                  role="tab"
                  className={`tab font-body border-b-2 ${
                    activeTab === "requests"
                      ? "border-b-4"
                      : "border-transparent"
                  }`}
                  style={{
                    borderColor:
                      activeTab === "requests"
                        ? "rgba(248, 181, 0, 1)"
                        : "transparent",
                  }}
                  onClick={() => handleTabClick("requests")}
                >
                  Requests
                </button>
              )}
            </div>

            <div className="mt-5">
              {activeTab === "members" && (
                <>
                  {team?.members.length > 1 ? (
                    <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                      {team?.members.slice(1).map((member: TeamMember) => (
                        <MemberCard
                          key={member._id}
                          member={member}
                          imgUrl={member.profile_picture}
                          onClick={() => {
                            if (!isAuthenticated) {
                              return;
                            }
                            if (user.user_id === team?.members[0]?._id) {
                              setSelectedTeamMember(member);
                              openMemberDialog("member");
                            } else {
                              navigate(`/profile/${member._id}`);
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mt-2 w-full gap-4">
                      <HiOutlineUserGroup className="w-20 h-20 text-base-content" />
                      <p className="font-body text-base-content">
                        No team members
                      </p>
                    </div>
                  )}
                </>
              )}
              {activeTab === "challenges" && (
                <div>
                  {/* Only show filter buttons if the user is the team owner */}
                  {user.user_id === team?.members[0]?._id && (
                    <div className="flex gap-5 items-center mb-9 flex-wrap font-body">
                      <p>Filter By:</p>
                      <button
                        className={`px-8 py-2  rounded-sm ${filter === "all" ? "bg-yellow text-darkgrey" : "border border-base-content "}`}
                        onClick={() => {
                          setFilter("all");
                          setIsDeleteMode(false);
                          setSelectedChallenges([]);
                        }}
                      >
                        All
                      </button>
                      <button
                        className={`px-8 py-2 rounded-sm ${filter === "drafts" ? "bg-yellow text-darkgrey" : "border border-base-content"}`}
                        onClick={() => setFilter("drafts")}
                      >
                        Drafts
                      </button>

                      <button
                        className={`px-8 py-2 rounded-sm ${filter === "completed" ? "bg-yellow text-darkgrey" : "border border-base-content"}`}
                        onClick={() => {
                          setFilter("completed");
                          setIsDeleteMode(false);
                          setSelectedChallenges([]);
                        }}
                      >
                        Fully Created
                      </button>
                    </div>
                  )}

                  {/* Additional Buttons for Drafts */}
                  {user.user_id === team?.members[0]?._id &&
                    filteredChallenges.length > 0 && (
                      <>
                        <div className="flex gap-2 mb-9">
                          <button
                            className={`px-8 py-2 rounded-[3px] hover:bg-[#E50000] hover:text-white ${
                              isDeleteMode
                                ? "bg-[#E50000] text-white"
                                : "border border-[#E50000] text-[#E50000]"
                            }`}
                            onClick={handleDeleteDrafts}
                            disabled={isDeleting}
                          >
                            {isDeleteMode && isDeleting ? (
                              <div className="flex justify-center">
                                <span className="loading loading-dots loading-xs"></span>
                              </div>
                            ) : (
                              <span className="font-body">
                                Delete{" "}
                                {isDeleteMode && (
                                  <>({selectedChallenges.length})</>
                                )}{" "}
                                {!isDeleteMode && <span>Challenges</span>}
                              </span>
                            )}
                          </button>

                          {isDeleteMode && (
                            <button
                              className=" px-8 py-2 border rounded-[3px] border-[#393E46] font-body"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                        {isDeleteMode && (
                          <p className="text-base-content mb-4 font-body">
                            Click on a challenge to select it for deletion and
                            click <strong>Delete</strong> to confirm your
                            selection.
                          </p>
                        )}
                      </>
                    )}

                  {/* Challenges */}
                  <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                    {filteredChallenges.length > 0 ? (
                      filteredChallenges.map((challenge: Challenge) => (
                        <ChallengesCard
                          key={challenge._id}
                          challenge={challenge}
                          isDeleteMode={isDeleteMode}
                          styles={"h-[140px] w-[310px] m-auto sm:mx-0"}
                          isSelected={selectedChallenges.includes(
                            challenge._id,
                          )}
                          section="team-details"
                          onCardClick={() => {
                            if (isDeleteMode) {
                              setSelectedChallenges((prev) =>
                                prev.includes(challenge._id)
                                  ? prev.filter((id) => id !== challenge._id)
                                  : [...prev, challenge._id],
                              );
                            } else {
                              navigate(`/challenge/${challenge._id}`);
                            }
                          }}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center mt-2 w-full gap-4">
                        <GrTest className="w-20 h-20 text-base-content" />
                        <p className="font-body">No Challenges to display</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "requests" &&
                user.user_id === team?.members[0]?._id && (
                  <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                    {requests.length > 0 ? (
                      requests
                        .filter(
                          (request: Request) =>
                            request.status !== "APPROVED" &&
                            request.status !== "DECLINED",
                        ) // Filter out APPROVED and DECLINED requests
                        .map((request: Request) => (
                          <MemberCard
                            key={request._id}
                            member={request.userProfile}
                            imgUrl={request.userProfile.profile_picture}
                            onClick={() => {
                              if (user.user_id === team?.members[0]?._id) {
                                setSelectedRequest(request);
                                openMemberDialog("request");
                              } else {
                                // Do nothing
                              }
                            }}
                          />
                        ))
                    ) : (
                      <div className="flex flex-col items-center mt-2 w-full gap-4">
                        <HiOutlineUserGroup className="w-20 h-20 text-base-content" />
                        <p className="font-body text-base-content">
                          No Member Requests
                        </p>
                      </div>
                    )}
                  </div>
                )}
            </div>

            <div className="fixed bottom-0 right-0 m-4">
              {activeTab === "challenges" &&
                user.user_id === team?.members[0]?._id && (
                  <button
                    className="text-darkgrey bg-[#F8B500] px-4 py-2 font-body rounded"
                    onClick={() => navigate("/create-challenge")}
                  >
                    Create Challenge
                  </button>
                )}
              {activeTab === "members" && (
                <>
                  {owner ? (
                    <button
                      className="text-darkgrey text-[14px] bg-yellow font-body rounded px-4 py-2"
                      onClick={() => {
                        const modal = document.getElementById(
                          "my_modal_3",
                        ) as HTMLDialogElement | null;
                        if (modal) {
                          modal.showModal();
                        }
                      }}
                    >
                      Add Member
                    </button>
                  ) : team?.members.length > 1 &&
                    team.members
                      .slice(1)
                      .some(
                        (member: TeamMember) => member._id === user.user_id,
                      ) ? (
                    <button
                      className="text-white text-[14px] bg-[#C83A3A] font-body rounded px-4 py-2"
                      onClick={() => {
                        const modal = document.getElementById(
                          "my_modal_5",
                        ) as HTMLDialogElement | null;
                        if (modal) {
                          modal.showModal();
                        }
                      }}
                    >
                      Leave Team
                    </button>
                  ) : (
                    <button
                      className={`text-[14px] text-darkgrey font-body rounded flex items-center justify-center px-4 py-2 ${
                        isClicked || userRequest
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow"
                      }`}
                      onClick={handleRequestClick}
                      disabled={isClicked || userRequest || isPending}
                    >
                      {isPending ? (
                        <div className="flex justify-center">
                          <span className="loading loading-dots loading-xs"></span>
                        </div>
                      ) : (isClicked && !sendRequestError) || userRequest ? (
                        "Requested"
                      ) : (
                        "Request to join"
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <AddMemberDialog teamId={teamId as string} />
        <LeaveTeamDialog teamId={teamId!} />
        <MemberRequestDialog
          mode={dialogMode}
          teamId={teamId as string}
          selectedTeamMember={selectedTeamMember}
          selectedRequest={selectedRequest}
        />
        <TeamOwnerDialog selectedTeamMember={team.members[0]} />
        <AuthenticationModal team={team} />
      </>
    </div>
  );
};

export default TeamDetailsPage;

// Georgecl00ney!
// Bern1eM@c
// BradP1tt!
// C@ptainBubb11ez!
