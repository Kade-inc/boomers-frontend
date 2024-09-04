interface ProfileCardProps {
  className: string;
}

const ProfileCard = ({ className }: ProfileCardProps) => {
  return (
    <div
      className={`bg-yellow flex flex-col mx-auto p-[10px] w-[230px] h-[200px] rounded-[5px] items-center justify-center gap-3 shadow-md ${className}`}
    >
      <div className="rounded-full w-[100px] h-[100px]">
        <img
          src="src\assets\Mask-group.png"
          alt="profile Picture"
          className="w-full rounded-full object-cover"
        />
      </div>
      <div className="w-[115px] h-[20px] text-darkgrey font-body font-[600] text-[16px] leading-[19.5px] text-center">
        <h1>paul_dreamer</h1>
      </div>
      <button className="bg-darkgrey w-[114px] h-[25px] rounded-[3px] text-white font-body font-[500] text-[12px] leading-[14.63px] text-center">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
