import TeamMember from "../entities/TeamMember";
import Request from "../entities/Request";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface MemberCardProps {
  member?: TeamMember;
  request?: Request;
  imgUrl?: string | null;
  onClick?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  request,
  imgUrl,
  onClick,
}) => {
  const firstname = member?.firstName || request?.userProfile.firstName;
  const lastname = member?.lastName || request?.userProfile.lastName;
  const username = member?.username || request?.userProfile?.username;
  const displayName =
    firstname && lastname
      ? `${firstname} ${lastname}`
      : firstname || lastname || username;

  return (
    <div
      className="card w-[166px] h-[170px] bg-base-100 font-body cursor-pointer 
  border border-base-200 shadow-md shadow-base-content/10"
      onClick={onClick}
    >
      <div className="card-body flex flex-col justify-center items-center">
        {imgUrl ? (
          <img
            className="h-[81px] w-[81px] rounded-full"
            src={imgUrl}
            alt="Profile"
          />
        ) : (
          <UserCircleIcon className="h-[81px] w-[81px] text-darkgrey" />
        )}
        <p className="text-center">{displayName}</p>
      </div>
    </div>
  );
};

export default MemberCard;
