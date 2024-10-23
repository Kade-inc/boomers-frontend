import AdviceCard from "../components/AdviceCard";
import CardCarousel from "../components/CardCarousel";
import ChallengeCardCarousel from "../components/ChallengeCardCarousel";
import ProfileCard from "../components/ProfileCard";
import TeamCard from "../components/TeamCard";
import Team from "../entities/Team";
import useChallenges from "../hooks/useChallenges";
import useProfile from "../hooks/useProfile";
import useTeamRecommendations from "../hooks/useTeamRecommendations";
import useTeams from "../hooks/useTeams";
import useAuthStore from "../stores/useAuthStore";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { data: teamsData } = useTeams(user.user_id);
  const { data: teamRecommendations } = useTeamRecommendations();
  const { data: challenges } = useChallenges(user.user_id || "");
  const { data: userProfile } = useProfile()

  return (
    <>
      <div className="h-screen w-full px-5 md:px-10 pt-10 lg:flex lg:justify-between font-body">
        <div className="min-h-80 xl:w-4/5 lg:w-full md:w-full">
          <div>
            <p className="font-body font-regular text-darkgrey text-[14px]">
              Hi, username
            </p>
            <p className="font-body font-regular text-darkgrey text-[20px]">
              Welcome Back!
            </p>
          </div>
          <div className="mt-6">
            <div className="flex flex-row">
              <p className="font-body font-semibold text-darkgrey text-[16px] mr-5">
                Your Houses
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#F8B500"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {teamsData?.length == 0 && (
              <>
                <div className="flex items-center flex-col text-darkgrey text-[16px] mt-10">
                  <p className="mb-6">
                    You do not belong to any team currently.
                  </p>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <button className="px-8 py-2.5 text-[14px] font-regular bg-[#000] rounded-[4px] text-white">
                      Create Team
                    </button>
                    <button className="px-8 py-2.5 text-[14px] font-regular bg-yellow rounded-[4px] text-darkgrey">
                      Join a Team
                    </button>
                  </div>
                </div>

                <div className="flex items-center flex-col text-darkgrey text-[16px] mt-10">
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
                          <button className="px-8 py-2.5 text-[14px] font-regular bg-[#000] rounded-[4px] text-white mt-2">
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {teamRecommendations && teamRecommendations?.length > 0 && (
                    <>
                      <div className="carousel carousel-center space-x-6 pt-4 max-w-md md:max-w-screen-sm lg:max-w-screen-lg xl:max-w-screen-xl">
                        {teamRecommendations
                          ?.slice(0, 2)
                          .map((recommendation: Team) => (
                            <TeamCard
                              key={recommendation._id}
                              team={recommendation}
                              styles={`w-[450px]`}
                            />
                          ))}
                      </div>
                      <button className="px-8 py-2.5 text-[14px] font-regular bg-[#000] rounded-[4px] text-white mt-8">
                        View more
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            {teamsData && teamsData?.length > 0 && (
              <>
                <CardCarousel slides={teamsData} />
              </>
            )}
          </div>
          <div className="mt-12">
            <div className="flex flex-row">
              <p className="font-body font-semibold text-darkgrey text-[16px] mr-5">
                Challenges
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#F8B500"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {challenges?.length == 0 && (
              <div className="flex items-center flex-col text-darkgrey text-[16px] mt-10">
                <p className="mb-6">
                  You&apos;re all caught up! No challenges to display.
                </p>
              </div>
            )}
            {challenges && challenges?.length > 0 && (
              <>
                <ChallengeCardCarousel
                  slides={challenges}
                  teamsData={teamsData}
                />
              </>
            )}
          </div>
        </div>
        <div className="bg-white shadow-lg rounded h-5/6 lg:w-[300px] xl:w-1/5 xl:flex lg:flex lg:right-3 lg:top-15 hidden py-5 flex-col z-50">
          <ProfileCard user={user} className="mb-5" />
          <AdviceCard className="" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
