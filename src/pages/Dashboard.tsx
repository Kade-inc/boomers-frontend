import AdviceCard from "../components/AdviceCard";
import ProfileCard from "../components/ProfileCard";
import TeamCard from "../components/TeamCard";
import Team from "../entities/Team";
import useTeamRecommendations from "../hooks/useTeamRecommendations";
import useTeams from "../hooks/useTeams";
import useAuthStore from "../stores/useAuthStore";
import { useEffect, useState } from "react";
import Challenge from "../entities/Challenge";
import { Link, useNavigate } from "react-router-dom";
import useRecommendationStore from "../stores/useRecommendationStore";
import RecommendationsModal from "../components/Modals/RecommendationsModal";
import TeamCardCarousel from "../components/Carousels/TeamCardCarousel";
import ChallengeCardCarousel from "../components/Carousels/ChallengeCardCarousel";
import useChallenges from "../hooks/Challenges/useChallenges";
import PendingRequests from "../components/PendingRequest";
import useTeamSpotlight from "../hooks/useTeamSpotlight";
import SpotlightCard from "../components/Cards/SpotlightCard";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import ActionCenterModal from "../components/Modals/ActionCenterModal";
import useAdvice from "../hooks/useAdvice";
import useGetJoinRequests from "../hooks/useGetJoinRequests";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: teamsData, isPending: teamsLoading } = useTeams({
    userId: user.user_id,
  });
  const { data: teamRecommendations, isPending: recommendationsLoading } =
    useTeamRecommendations();
  const { data: challengesData, isPending: challengesLoading } = useChallenges(
    user.user_id || "",
  );
  const { data: teamSpotlight, isPending: pendingSpotlight } =
    useTeamSpotlight();

  console.log("TEST: ", teamSpotlight);
  const {
    data: advice,
    isPending: adviceLoading,
    error: adviceError,
  } = useAdvice();

  const {
    data: requests,
    isPending: requestsLoading,
    error: requestsError,
  } = useGetJoinRequests();
  const [teams, setTeams] = useState<Team[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [teamsFilter, setTeamsFilter] = useState("AllTeams");
  const [challengesFilter, setChallengesFilter] = useState("AllChallenges");
  const [showActionCenterModal, setShowActionCenterModal] = useState(false);
  const closeActionCenterModal = () => setShowActionCenterModal(false);
  const navigate = useNavigate();
  const setRecommendations = useRecommendationStore(
    (s) => s.setRecommendations,
  );

  const navigateToRecommendations = () => {
    navigate("/recommendations");
  };

  useEffect(() => {
    if (teamsData) {
      setTeams(teamsData.data);
    }
  }, [teamsData]);

  useEffect(() => {
    if (challengesData) {
      const freshChallenges = challengesData
        .filter((challenge) => {
          if (!challenge.due_date) return false;
          const dueDate = new Date(challenge.due_date);
          const now = new Date();
          return dueDate > now;
        })
        // Sort challenges by expiry date
        .sort((a, b) => {
          const dateA = new Date(a.due_date!);
          const dateB = new Date(b.due_date!);
          return dateA.getTime() - dateB.getTime();
        });
      setChallenges(freshChallenges);
    }
  }, [challengesData]);

  useEffect(() => {
    if (teamRecommendations) {
      setRecommendations(teamRecommendations);
    }
  }, [teamRecommendations]);

  const filteredTeams = teams.filter((team) => {
    if (teamsFilter === "AllTeams") return true;
    if (teamsFilter === "Owner") return team.owner_id === user.user_id;
    if (teamsFilter === "Member") return team.owner_id !== user.user_id;
    return true;
  });

  const filteredChallenges = challenges.filter((challenge) => {
    if (challengesFilter === "AllChallenges") return true;
    if (challengesFilter === "Owner")
      return challenge.owner_id === user.user_id;
    if (challengesFilter === "Member")
      return challenge.owner_id !== user.user_id;
    return true;
  });

  const handleTeamsFilter = (filter: string) => {
    setTeamsFilter(filter);
  };

  const handleChallengesFilter = (filter: string) => {
    setChallengesFilter(filter);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Team | null>(null);

  const openModal = (team: Team) => {
    setIsModalOpen(true);
    setSelectedRecommendation(team);
  };
  const closeModal = () => setIsModalOpen(false);

  if (teamsLoading || recommendationsLoading || challengesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
  return (
    <>
      <div className="h-screen w-full px-5 md:px-10 pt-10 lg:flex lg:justify-between font-body bg-base-100 text-base-content">
        <div className="min-h-80 xl:w-4/5 lg:w-full md:w-full">
          <div>
            <p className="font-body text-[16px]">
              Hi, {user.firstName ? <>{user.firstName}</> : user.username}
            </p>
            <p className="font-body font-medium text-[20px]">Welcome Back!</p>
          </div>
          <div className="mt-6">
            {teamsData.data?.length !== 0 && (
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex flex-row mb-5 md:mb-0">
                  <p className="font-body font-semibold text-[16px] mr-5">
                    Your Houses
                  </p>
                  <div
                    className="tooltip tooltip-top tooltip-warning"
                    data-tip="Add team"
                    onClick={() => navigate("/create-team")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#F8B500"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-row justify-between content-center items-center text-[13px] md:text-[14px] font-medium">
                  <p className="md:ml-10 ">Filter:</p>
                  <div
                    className={`ml-3 md:ml-5 py-1 px-6 rounded-md  cursor-pointer ${
                      teamsFilter === "AllTeams"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleTeamsFilter("AllTeams")}
                  >
                    All
                  </div>
                  <div
                    className={`ml-3 md:ml-5  py-1 px-6 rounded-md cursor-pointer ${
                      teamsFilter === "Member"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleTeamsFilter("Member")}
                  >
                    Member
                  </div>
                  <div
                    className={`ml-3 md:ml-5  py-1 px-6 rounded-md cursor-pointer ${
                      teamsFilter === "Owner"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleTeamsFilter("Owner")}
                  >
                    Owner
                  </div>
                </div>
              </div>
            )}

            {teamsData.data?.length == 0 && (
              <>
                <div className="flex items-center flex-col text-[16px] mt-10">
                  <p className="mb-6">
                    You do not belong to any team currently.
                  </p>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <button className="px-8 py-2.5 text-[14px] font-medium bg-[#000] rounded-[4px] text-white">
                      Create Team
                    </button>
                    <button className="px-8 py-2.5 text-[14px] font-medium bg-yellow rounded-[4px] text-darkgrey">
                      Join a Team
                    </button>
                  </div>
                </div>

                <div className="flex items-center flex-col text-[16px] mt-10">
                  <p className="mb-6 font-semibold">
                    Team recommendations based on your profile.
                  </p>
                  {teamRecommendations?.length === 0 && (
                    <>
                      <div className="flex flex-col items-center justify-center">
                        <p className="mb-6">No recommendations found.</p>
                        <div className="flex flex-col items-center justify-center">
                          <p className="mb-6">
                            Edit your profile with your interests to get
                            recommendations.
                          </p>
                          <Link to="/profile">
                            <button className="px-8 py-2.5 text-[14px] font-regular bg-[#000] rounded-[4px] text-white mt-2">
                              Edit Profile
                            </button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                  {teamRecommendations && teamRecommendations?.length > 0 && (
                    <>
                      <div className="flex flex-col md:flex-row justify-center items-center w-full">
                        {teamRecommendations
                          ?.slice(0, 2)
                          .map((recommendation: Team) => (
                            <TeamCard
                              key={recommendation._id}
                              team={recommendation}
                              styles={`w-full md:w-[400px] h-[130px] md:h-[200px] mb-3 md:mb-0 md:ml-6`}
                              onClick={() => openModal(recommendation)}
                            />
                          ))}
                      </div>
                      {selectedRecommendation !== null && (
                        <RecommendationsModal
                          isOpen={isModalOpen}
                          onClose={closeModal}
                          modalData={selectedRecommendation}
                        />
                      )}
                      <button
                        className="px-8 py-2.5 text-[14px] font-regular bg-[#000] rounded-[4px] text-white mt-8"
                        onClick={navigateToRecommendations}
                      >
                        View more
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            {filteredTeams && filteredTeams?.length > 0 && (
              <>
                <TeamCardCarousel slides={filteredTeams} />
              </>
            )}
            {filteredTeams.length === 0 && (
              <div className="flex items-center flex-col mt-10">
                <p className="mb-6">No teams to display.</p>
              </div>
            )}
          </div>
          <div className="mt-12">
            {teamsData && teamsData.data?.length !== 0 && (
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex flex-row mb-5 md:mb-0">
                  <p className="font-body font-semibold text-[16px] mr-5">
                    Challenges
                  </p>
                  <div
                    className="tooltip tooltip-top tooltip-warning"
                    data-tip="Add Challenge"
                    onClick={() => navigate("/create-challenge")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#F8B500"
                      className="size-6 cursor-pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-row justify-between content-center items-center text-[13px] md:text-[14px] font-medium">
                  <p className="md:ml-10">Filter:</p>
                  <div
                    className={`ml-3 md:ml-5 py-1 px-6 rounded-md  cursor-pointer ${
                      challengesFilter === "AllChallenges"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleChallengesFilter("AllChallenges")}
                  >
                    All
                  </div>
                  <div
                    className={`ml-3 md:ml-5 py-1 px-6 rounded-md cursor-pointer ${
                      challengesFilter === "Member"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleChallengesFilter("Member")}
                  >
                    Member
                  </div>
                  <div
                    className={`ml-3 md:ml-5 py-1 px-6 rounded-md cursor-pointer ${
                      challengesFilter === "Owner"
                        ? "bg-yellow font-medium text-darkgrey"
                        : "border border-base-content"
                    }`}
                    onClick={() => handleChallengesFilter("Owner")}
                  >
                    Owner
                  </div>
                </div>
              </div>
            )}
            {teamsData.data.length > 0 && challengesData?.length == 0 && (
              <div className="flex items-center flex-col text-[16px] mt-10">
                <p className="mb-6">
                  You&apos;re all caught up! No challenges to display.
                </p>
              </div>
            )}

            {filteredChallenges && filteredChallenges?.length > 0 && (
              <>
                <ChallengeCardCarousel
                  slides={filteredChallenges}
                  teamsData={teamsData.data}
                />
              </>
            )}
          </div>
        </div>
        <div
          className={`shadow-slate-300 rounded h-5/6 xl:w-[300px] xl:w-1/5 xl:flex xl:flex xl:right-3 xl:top-15 hidden py-5 flex-col bg-base-200 shadow-sm  min-h-max`}
        >
          <ProfileCard user={user} className="mb-5" />
          <AdviceCard
            advice={advice}
            isPending={adviceLoading}
            error={adviceError}
          />
          {!pendingSpotlight && teamSpotlight && (
            <>
              <p className="font-bold text-base-content flex justify-center mb-2">
                Team Spotlight
              </p>
              <SpotlightCard
                team={teamSpotlight}
                styles={`w-[90%] h-[150px]`}
                onClick={() => navigate(`/teams/${teamSpotlight._id}`)}
              />
            </>
          )}

          {!requestsLoading ? (
            <PendingRequests
              requests={requests}
              user={user}
              error={requestsError}
            />
          ) : (
            <div className="flex justify-center mt-4">
              {" "}
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
        </div>
        <div
          className="flex justify-center h-[55px] w-[55px] bg-gradient-to-b from-[#00989B] to-[#005E78] bottom-16  md:hidden z-30 right-3 rounded-full fixed"
          onClick={() => setShowActionCenterModal(!showActionCenterModal)}
        >
          <button className="">
            <PresentationChartBarIcon width={30} height={30} color="white" />
          </button>
        </div>
      </div>
      {showActionCenterModal && (
        <ActionCenterModal
          isOpen={showActionCenterModal}
          onClose={closeActionCenterModal}
        >
          <AdviceCard
            advice={advice}
            isPending={adviceLoading}
            error={adviceError}
          />
          <PendingRequests
            requests={requests}
            user={user}
            error={requestsError}
          />
        </ActionCenterModal>
      )}
    </>
  );
};

export default Dashboard;
