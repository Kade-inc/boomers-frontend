import User from "../entities/User";

interface ProfileCardProps {
  user?: User;
  className: string;
}

const ProfileCard = ({ user, className }: ProfileCardProps) => {
  return (
    <div
      className={`bg-yellow flex flex-col mx-auto p-[30px] w-[90%] rounded-[5px] items-center justify-center gap-3 hover:shadow-lg hover:cursor-pointer ${className}`}
    >
      <div className="rounded-full w-[130px] h-[130px]">
        <img
          src="src\assets\Mask-group.png"
          alt="profile Picture"
          className="w-full rounded-full object-cover"
        />
      </div>
      {user && (
        <>
          <div className="w-[115px] h-[20px] text-darkgrey font-body font-[600] text-[16px] leading-[19.5px] text-center">
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
      <button className="bg-darkgrey px-10 h-[35px] rounded-[3px] text-white font-body font-[500] text-[14px] leading-[14.63px] text-center">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
