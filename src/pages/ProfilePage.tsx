import maskgroup from "../assets/Mask group.svg";
import location from "../assets/location-sign-svgrepo-com 1.svg";
import ellipse from "../assets/Ellipse 81.svg";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { user } = useAuthStore();

  const [profileData, setProfileData] = useState(user);

  const { data: teams } = useTeams(user.user_id);
  console.log("TEAMS: ", teams);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      console.log("Hapa: ", user);
    }
  }, [user]);

  return (
    <div className="flex justify-center min-h-screen w-full bg-base-100 pb-8">
      <div className=" flex flex-col w-[90%] max-w-4xl mx-aut mt-10">
        <div className="bg-base-200 shadow-custom relative text-base-content rounded-[5px] pb-4 mt-4">
          <div className="bg-custom-gradient w-full h-[70px] md:h-[157px]"></div>
          <div className="px-4 md:px-10">
            <div className="absolute top-[40px] md:top-[110px] w-[70px] h-[70px] md:w-[90px] md:h-[90px]">
              <img
                src={profileData.profile_picture || maskgroup}
                alt="Profile"
                className="object-cover h-[90px] w-[90px] rounded-full"
              />
            </div>
            <div className="flex justify-between mt-16 md:mt-12">
              <div>
                <h1 className="font-body font-bold text-base md:text-lg  mb-3">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="flex items-center font-body font-normal text-[13px] md:text-base  mb-3">
                  <img src={location} className="w-[11px] h-[11px] mr-2" />
                  <p>Las Vegas</p>
                </p>

                <div className="flex flex-col md:flex-row items-start md:items-center font-body font-normal text-[13px] md:text-base  mb-3">
                  @{profileData.username}
                  {profileData.job && (
                    <>
                      <img src={ellipse} className="mx-2 hidden md:block" />
                      <p className="font-semibold font-body text-[13px] md:text-base  text-nowrap">
                        {profileData.job}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <button
                  className="px-4 md:px-6 h-[32px] max-w-full rounded-[5px] bg-yellow font-body font-semibold text-[11px] md:text-sm  text-nowrap text-darkgrey"
                  onClick={openModal}
                >
                  <span className="block md:hidden">Edit</span>
                  <span className="hidden md:block">Edit Profile</span>
                </button>
                <EditProfileModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  // onSubmit={handleProfileUpdate}
                  user={user}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-2">
          <div className="font-body  ml-6 my-4">
            <h1 className=" font-semibold text-base md:text-lg ">Bio</h1>
            <p className="font-medium text-[13px] md:text-base  mt-2">
              {profileData.bio || null}
            </p>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-4">
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
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-12">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg ">
              Your Houses
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
