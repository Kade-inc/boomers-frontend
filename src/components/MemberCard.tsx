import React from "react"; // Import React if you're using React
import elipse from "../assets/Ellipse 103.svg";
import TeamMember from "../entities/TeamMember";

interface MemberCardProps {
  member: TeamMember;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="card w-[166px] h-[166px] bg-white">
      <div className="card-body flex flex-col justify-center items-center">
        <img className="h-[81px] w-[81px]" src={elipse} alt="elipse" />
        <p>{member.username}</p>
      </div>
    </div>
  );
};

export default MemberCard;
