import location from "../assets/location-sign-svgrepo-com 1.svg";
import ellipse from "../assets/Ellipse 81.svg";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Team from "../entities/Team";
import TeamCardCarousel from "../components/Carousels/TeamCardCarousel";
import { useNavigate, useParams } from "react-router-dom";
import useGetUser from "../hooks/useGetUser";
import User from "../entities/User";
import UpdatedUserProfile from "../entities/UpdatedUserProfile";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState<
    User | UpdatedUserProfile | null
  >(null);
  const { data: teamsData, isPending: teamsPending } = useTeams({
    userId: userId || user.user_id,
  });
  const {
    data: userProfile,
    isPending: userProfilePending,
    error: userProfileError,
  } = useGetUser(userId!);

  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (userId && userProfile) {
      setProfileData(userProfile);
    } else {
      console.log("HAPA");
      console.log("USER: ", user);
      setProfileData(user);
    }
  }, [userId, userProfile, user]);

  useEffect(() => {
    if (teamsData?.data) {
      const userTeams = teamsData.data.filter(
        (team: Team) => team.owner_id === (userId || user.user_id),
      );
      setTeams(userTeams);
    }
  }, [teamsData, userId, user.user_id]);

  if (userId && userProfilePending)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  if (userId && userProfileError)
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-base-content font-body">Error Loading Profile</p>
        <button
          className="btn bg-yellow font-medium mt-5 hover:bg-yellow text-darkgrey font-body"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    );

  return (
    <div className="flex justify-center min-h-screen w-full bg-base-100 pb-8">
      <div className=" flex flex-col w-[90%] max-w-4xl mx-auto mt-10">
        <div className="bg-base-200 shadow-custom relative text-base-content rounded-[5px] pb-4 mt-4">
          <div className="bg-custom-gradient w-full h-[70px] md:h-[157px]"></div>
          <div className="pl-6">
            <div className="rounded-full overflow-hidden absolute top-[40px] md:top-[110px] w-24 h-24">
              {profileData?.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-yellow" />
              )}
            </div>
            <div className="flex justify-between mt-16">
              <div>
                <h1 className="font-body font-bold text-base md:text-lg my-2 md:mt-0">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                {profileData?.location && (
                  <>
                    <div className="flex items-center font-body font-normal text-[13px] md:text-base mb-2">
                      <img src={location} className="w-[11px] h-[11px] mr-2" />
                      <p>{profileData?.location}</p>
                    </div>
                  </>
                )}

                <div className="flex flex-col md:flex-row items-start md:items-center font-body font-normal text-[13px] md:text-base mb-2">
                  @{profileData?.username}
                  {profileData?.job && (
                    <>
                      <img src={ellipse} className="mx-2 hidden md:block" />
                      <p className="font-semibold font-body text-[13px] md:text-base text-nowrap mt-3 md:mt-0">
                        {profileData?.job}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div>
                {!userId && (
                  <button
                    className="px-4 md:px-6 h-[32px] max-w-full rounded-[5px] bg-yellow font-body font-semibold text-[11px] md:text-sm  text-nowrap text-darkgrey hover:bg-yellow mr-5"
                    onClick={openModal}
                  >
                    <span className="block md:hidden">Edit</span>
                    <span className="hidden md:block">Edit Profile</span>
                  </button>
                )}
                {isModalOpen && (
                  <EditProfileModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    user={user}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-2">
          <div className="font-body  ml-6 my-4">
            <h1 className=" font-semibold text-base md:text-lg ">Bio</h1>
            <p className="font-medium text-[13px] md:text-base  mt-2">
              {profileData?.bio || null}
            </p>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-4">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg ">
              Your Interests
            </h1>
            <div className="flex flex-wrap gap-4 justify-start mt-2">
              {profileData?.interests?.domain.map((d, index) => (
                <div
                  key={index}
                  className="border py-2 px-4 rounded-sm border-lightgrey font-body font-medium text-sm"
                >
                  {d}
                </div>
              ))}

              {profileData?.interests?.domainTopics.map((t, index) => (
                <div
                  key={index}
                  className="border py-2 px-4 rounded-sm border-lightgrey font-body font-medium text-sm"
                >
                  {t}
                </div>
              ))}

              {profileData?.interests?.subdomain.map((sd, index) => (
                <div
                  key={index}
                  className="border py-2 px-4 rounded-sm border-lightgrey font-body font-medium text-sm "
                >
                  {sd}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-base-200 mt-4 shadow-custom text-base-content rounded-[5px] pb-12">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg ">
              Your Houses
            </h1>
            {teamsPending ? (
              <div className="flex justify-center items-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : teams && teams.length > 0 ? (
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
