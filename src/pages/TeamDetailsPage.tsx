import { useState } from "react";
import lebron from "../assets/Mask group.svg";
import ChallengesCard from "../components/ChallengesCard";
import MemberCard from "../components/MemberCard";
import { useParams } from "react-router-dom";
import TeamMember from "../entities/TeamMember";
import useTeam from "../hooks/useTeam";
import useTeamChallenges from "../hooks/useTeamChallenges";
import useTeamMemberRequests from "../hooks/useTeamMemberRequests";
import { Toaster } from "react-hot-toast";
import Challenge from "../entities/Challenge";
import Request from "../entities/Request";
import useAuthStore from "../stores/useAuthStore";
import AddMemberDialog from "../components/AddMemberDialog";
import LeaveTeamDialog from "../components/LeaveTeamDialog";
import MemberRequestDialog from "../components/MemberRequestDialog";
import React from "react";

const TeamDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { teamId } = useParams<{ teamId: string }>();

  const [dialogMode, setDialogMode] = useState<"request" | "member">("request");

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

  //user
  const { user } = useAuthStore.getState();

  const {
    data: team,
    isPending: isTeamPending,
    error: teamError,
  } = useTeam(teamId || "");
  const {
    data: challenges,
    isPending: isChallengesPending,
    error: challengesError,
  } = useTeamChallenges(teamId || "");
  const {
    data: requests,
    isPending: isTeamMemberRequestsPending,
    error: teamMemberRequestsError,
  } = useTeamMemberRequests(teamId || "");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const owner = user.user_id === team?.members[0]?._id;

  if (isTeamPending || isChallengesPending || isTeamMemberRequestsPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-lg text-base-content"></span>
      </div>
    );
  }

  if (teamError) {
    return <p>Error loading page.</p>;
  }

  return (
    <div className="h-screen bg-base-100 py-10 px-[40px]">
      <>
        {teamError && (
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
        {teamMemberRequestsError ||
          (requests?.length < 1 && (
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
          ))}
        {team && (
          <>
            <div
              className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white p-0 w-full h-[200px] rounded-[3px] font-body"
              style={{ background: team?.teamColor }}
            >
              <div className="card-body">
                <div className="flex justify-between w-full items-center">
                  <div>
                    <h2 className="font-bold text-[20px] mb-5">{team?.name}</h2>
                    <p className="mb-3 text-[18px] font-medium">
                      Specialization
                    </p>

                    <div className="flex items-center mb-2 font-regular text-[14px]">
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
                  <div className="text-center flex flex-col items-center justify-center">
                    <img className="mb-3 mx-auto" src={lebron} alt="img" />
                    <p>{team?.members[0]?.username}</p>
                    <p className="text-center text-[12px]">Owner</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              role="tablist"
              className="tabs tabs-bordered max-w-md ml-0 mt-4"
            >
              {["members", "challenges"].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  className={`tab font-body border-b-2 ${
                    activeTab === tab ? "border-b-4" : "border-transparent"
                  }`}
                  style={{
                    borderColor:
                      activeTab === tab
                        ? "rgba(248, 181, 0, 1)"
                        : "transparent",
                  }}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}

              {user.user_id === team?.members[0]?._id && (
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
                <div className="flex gap-6">
                  {team?.members.slice(1).map((member: TeamMember) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      imgUrl={member.profile_picture}
                      onClick={() => {
                        if (user.user_id === team?.members[0]?._id) {
                          openMemberDialog("member");
                        } else {
                          // Do nothing
                        }
                      }}
                    />
                  ))}
                </div>
              )}

              {activeTab === "challenges" && (
                <div>
                  {challenges &&
                    challenges.map((challenge: Challenge) => (
                      <ChallengesCard
                        key={challenge._id}
                        challenge={challenge}
                        styles={"w-[300px]"}
                      />
                    ))}
                  {!challenges && (
                    <>
                      <p className="font-body">No Challenges to display</p>
                    </>
                  )}
                </div>
              )}

              {user.user_id === team?.members[0]?._id &&
                activeTab === "requests" && (
                  <div className="flex gap-6">
                    {requests.length > 0 ? (
                      requests.map((request: Request) => (
                        <MemberCard
                          key={request._id}
                          member={request.userProfile}
                          imgUrl={request.userProfile.profile_picture}
                          onClick={() => openMemberDialog("request")}
                        />
                      ))
                    ) : (
                      <p className="font-body">No Member Requests</p>
                    )}
                  </div>
                )}
            </div>

            <div className="flex justify-end mt-12">
              {activeTab === "challenges" &&
                user.user_id === team?.members[0]?._id && (
                  <button className="w-[98px] text-[14px] p-1 text-black bg-yellow sm:w-[143px] font-body rounded">
                    Create Challenge
                  </button>
                )}
              {activeTab === "members" && (
                <>
                  {owner ? (
                    <button
                      className="w-[98px] text-[14px] p-1 text-black bg-yellow sm:w-[143px] font-body rounded"
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
                      className="w-[98px] text-[14px] p-1 text-white bg-red-600 sm:w-[143px] font-body rounded"
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
                    <button className="w-[98px] text-[14px] p-1 text-black bg-yellow sm:w-[143px] font-body rounded">
                      Request
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <AddMemberDialog />
        <LeaveTeamDialog />
        <MemberRequestDialog mode={dialogMode} />
      </>
    </div>
  );
};

export default TeamDetailsPage;

// Georgecl00ney!
// Bern1eM@c
