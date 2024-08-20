import maskgroup from "../assets/Mask group.svg";
import groupcard from "../assets/Group 248.svg";
import location from "../assets/location-sign-svgrepo-com 1.svg";
import ellipse from "../assets/Ellipse 81.svg";

const ProfilePage = () => {
  return (
    <div className="relative flex justify-center h-screen w-full">
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        <div className="bg-white pb-2 shadow-custom">
          <div className="bg-custom-gradient w-full h-[70px] md:h-[157px]"></div>
          <div className="px-4 md:px-10">
            <div>
              <img
                src={maskgroup}
                className="absolute top-[40px] md:top-[110px] w-[70px] h-[70px] md:w-[90px] md:h-[90px]"
              ></img>
            </div>
            <div className="flex justify-between mt-16 md:mt-12">
              <div>
                <h1 className="font-body font-bold text-base md:text-lg text-darkgrey">
                  Paul Dreamer
                </h1>
                <p className="flex items-center font-body font-normal text-[13px] md:text-base text-darkgrey">
                  <img src={location} className="w-[11px] h-[11px] mr-2" /> Las
                  Vegas
                </p>

                <p className="flex flex-col md:flex-row items-center font-body font-normal text-[13px] md:text-base text-darkgrey">
                  @Lebron_James
                  <img src={ellipse} className="mx-2 hidden md:block" />
                  <p className="font-semibold font-body text-[13px] md:text-base text-black text-nowrap">
                    Software Engineer at Apple
                  </p>
                </p>
              </div>
              <div>
                <button className="px-4 md:px-6 h-[32px] rounded-[5px] bg-yellow font-body font-semibold text-[11px] md:text-sm text-darkgrey mr-10 text-nowrap">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom">
          <div className="font-body text-darkgrey ml-6 my-4">
            <h1 className=" font-semibold text-base md:text-lg ">Bio</h1>
            <p className="font-medium text-[13px] md:text-base  mt-2">
              A cool guy who plays a lot of basketball.
            </p>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg text-darkgrey">
              Your Interests
            </h1>
            <div className="flex flex-wrap gap-2 justify-start mt-2">
              <button className="px-4 border-[1px] rounded-[3px] h-[29px] border-lightgrey font-body font-medium text-sm text-darkgrey">
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
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 shadow-custom">
          <div className="ml-6 my-4">
            <h1 className="font-body font-semibold text-base md:text-lg text-darkgrey">
              Your Houses
            </h1>
            <img src={groupcard} className="mt-6"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
