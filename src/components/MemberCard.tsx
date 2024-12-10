import elipse from "../assets/user-image.svg";
import TeamMember from "../entities/TeamMember";
import Request from "../entities/Request";

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
  const username = member?.username || request?.userProfile?.username;
  const imageSource = imgUrl || elipse;

  return (
    <div
      className="card w-[166px] h-[166px] bg-base-100 font-body shadow-lg"
      onClick={onClick}
    >
      <div className="card-body flex flex-col justify-center items-center">
        <img
          className="h-[81px] w-[81px] rounded-full"
          src={imageSource}
          alt="image"
        />
        <p>{username}</p>
      </div>
    </div>
  );
};

export default MemberCard;
