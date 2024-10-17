import elipse from "../assets/Ellipse 103.svg";
import TeamMember from "../entities/TeamMember";
import Request from "../entities/Request";

interface MemberCardProps {
  member?: TeamMember;
  request?: Request;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, request }) => {
  const username = member?.username || request?.userProfile?.username;

  return (
    <div className="card w-[166px] h-[166px] bg-white font-body shadow-lg">
      <div className="card-body flex flex-col justify-center items-center">
        <img className="h-[81px] w-[81px]" src={elipse} alt="elipse" />
        <p>{username}</p>
      </div>
    </div>
  );
};

export default MemberCard;
