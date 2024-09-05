import maskgroup from "../assets/Mask group.svg";
import groupcard from "../assets/Group 248.svg";

import useGetUserProfile from "../hooks/useGetUserProfile";
import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = () => {
  const { data, error, isLoading } = useGetUserProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center h-screen">
        <span className="loading loading-ball loading-lg"></span>
      </div>
    );
  }

  if (error) return <div>Error: {error.message} </div>;

  return (
    <div className="flex justify-center min-h-screen w-full bg-[#F7F7F7] pb-8">
      <div className=" flex flex-col w-[90%] max-w-4xl mx-auto">
        <div className="bg-white relative shadow-custom rounded-[5px] pb-4 mt-4">
          <div className="bg-custom-gradient w-full h-[70px] md:h-[157px]"></div>
          <div className="px-4 md:px-10">
            <div className="absolute top-[40px] md:top-[110px] w-[70px] h-[70px] md:w-[90px] md:h-[90px]">
              <img src={maskgroup} />
            </div>
            <div className="flex justify-between mt-16 md:mt-12">
              <div>
                <h1 className="font-body font-bold text-base md:text-lg text-darkgrey">
                  {data?.profile.firstName}
                </h1>
                <p className="flex items-center font-body font-normal text-[13px] md:text-base text-darkgrey">
                  {/* <img src={location} className="w-[11px] h-[11px] mr-2" /> */}
                </p>

                <div className="flex flex-col md:flex-row items-start md:items-center font-body font-normal text-[13px] md:text-base text-darkgrey">
                  @{data!.profile.username}
                  {/* <img src={ellipse} className="mx-2 hidden md:block" /> */}
                  <p className="font-semibold font-body text-[13px] md:text-base text-darkgrey text-nowrap">
                    {/* Software Engineer at Apple */}
                  </p>
                </div>
              </div>
              <div>
                <button
                  className="px-4 md:px-6 h-[32px] max-w-full rounded-[5px] bg-yellow font-body font-semibold text-[11px] md:text-sm text-darkgrey text-nowrap"
                  onClick={openModal}
                >
                  <span className="block md:hidden">Edit</span>
                  <span className="hidden md:block">Edit Profile</span>
                </button>
                <EditProfileModal isOpen={isModalOpen} onClose={closeModal} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-2">
          <div className="font-body text-darkgrey ml-6 my-4">
            <h1 className=" font-semibold text-base md:text-lg ">Bio</h1>
            <p className="font-medium text-[13px] md:text-base  mt-2">No bio</p>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-4">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg text-darkgrey">
              Your Interests
            </h1>
            <div className="flex flex-wrap gap-2 justify-start mt-2">
              <p className="font-medium text-[13px] md:text-base  mt-2">
                No interests
              </p>
              {/* <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm text-darkgrey">
                Sofware Engineering
              </button>
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm text-darkgrey">
                Frontend
              </button>
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm text-darkgrey">
                React Js
              </button>
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm text-darkgrey">
                Design
              </button> */}
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom rounded-[5px] pb-12">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg text-darkgrey">
              Your Houses
            </h1>
            <img
              src={groupcard}
              className="mt-6 w-[95%] md:w-[40%] h-auto object-contain"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
