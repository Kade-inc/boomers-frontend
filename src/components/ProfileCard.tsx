import { UserCircleIcon } from "@heroicons/react/24/solid";
import User from "../entities/User";
import { Link } from "react-router-dom";
import ViewProfilePicture from "./Modals/ViewProfilePictureModal";

interface ProfileCardProps {
  user?: User;
  className: string;
}

const ProfileCard = ({ user, className }: ProfileCardProps) => {
  return (
    <div
      className={`bg-yellow flex flex-col mx-auto p-[30px] w-[90%] rounded-[5px] items-center justify-center gap-3 hover:shadow-lg hover:cursor-pointer ${className}`}
    >
      <div className="rounded-full w-32 h-32 overflow-hidden ">
        {user?.profile_picture ? (
          <ViewProfilePicture //when clicked opens the ViewProfilePictureModal
            src={user.profile_picture}
            alt="profile Picture"
            imgClassName="w-full h-full object-cover"
          />
        ) : (
          <UserCircleIcon className="w-full h-full text-darkgrey" />
        )}
      </div>
      {user && (
        <>
          <div className="text-darkgrey font-body font-semibold">
            <h1>
              {user.firstName && user.lastName ? (
                <>
                  {user.firstName} {user.lastName}
                </>
              ) : (
                user.username
              )}
            </h1>
          </div>
        </>
      )}
      <Link to="/profile">
        <button className="btn bg-darkgrey px-10 rounded-md text-white font-body font-medium text-[14px] border-none text-center hover:bg-darkgrey">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileCard;
