import location from "../assets/location-sign-svgrepo-com 1.svg";
import ellipse from "../assets/Ellipse 81.svg";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Team from "../entities/Team";
import TeamCardCarousel from "../components/TeamCardCarousel";

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState(user);
  const { data: teamsData, isPending: teamsPending } = useTeams(user.user_id);

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (teamsData) {
      const userTeam = teamsData.filter(
        (team: Team) => team.owner_id === user.user_id,
      );
      console.log("Filtered user teams:", userTeam);
      setTeams(userTeam);
    }
  }, [teamsData, user.user_id]);

  if (teamsPending || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen w-full bg-base-100 pb-8">
      <div className=" flex flex-col w-[90%] max-w-4xl mx-auto mt-10">
        <div className="bg-base-200 shadow-custom relative text-base-content rounded-[5px] pb-4 mt-4">
          <div className="bg-custom-gradient w-full h-[70px] md:h-[157px]"></div>
          <div className="pl-6">
            <div className="rounded-full overflow-hidden absolute top-[40px] md:top-[110px] w-24 h-24">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-darkgrey" />
              )}
            </div>
            <div className="flex justify-between mt-16">
              <div>
                <h1 className="font-body font-bold text-base md:text-lg my-2 md:mt-0">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                {profileData.location && (
                  <>
                    <p className="flex items-center font-body font-normal text-[13px] md:text-base mb-2">
                      <img src={location} className="w-[11px] h-[11px] mr-2" />
                      <p>{profileData.location}</p>
                    </p>
                  </>
                )}

                <div className="flex flex-col md:flex-row items-start md:items-center font-body font-normal text-[13px] md:text-base mb-2">
                  @{profileData.username}
                  {profileData.job && (
                    <>
                      <img src={ellipse} className="mx-2 hidden md:block" />
                      <p className="font-semibold font-body text-[13px] md:text-base text-nowrap mt-3 md:mt-0">
                        {profileData.job}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <button
                  className="px-4 md:px-6 h-[32px] max-w-full rounded-[5px] bg-yellow font-body font-semibold text-[11px] md:text-sm  text-nowrap text-darkgrey hover:bg-yellow mr-5"
                  onClick={openModal}
                >
                  <span className="block md:hidden">Edit</span>
                  <span className="hidden md:block">Edit Profile</span>
                </button>
                <EditProfileModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  user={user}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-2">
          <div className="font-body  ml-6 my-4">
            <h1 className=" font-semibold text-base md:text-lg ">Bio</h1>
            <p className="font-medium text-[13px] md:text-base  mt-2">
              {profileData.bio || null}
            </p>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-4">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg ">
              Your Interests
            </h1>
            <div className="flex flex-wrap gap-2 justify-start mt-2">
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm  mr-7">
                {profileData.interests?.domain}
              </button>
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm  mr-7">
                {profileData.interests?.domainTopics}
              </button>
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm ">
                {profileData.interests?.subdomain}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-12">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg ">
              Your Houses
            </h1>
            {teams && teams.length > 0 ? (
              <TeamCardCarousel slides={teams} />
            ) : (
              <p className="my-6">You do not belong to any team currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
