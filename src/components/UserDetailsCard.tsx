import React from "react";
import Team from "../entities/Team";

interface UserDetailsCardProps {
  team: Team;
  styles?: string;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ team, styles }) => {
  return (
    <div
      className={`card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white p-3 font-body rounded-none ${styles} h-[120px] w-[230px]`}
    >
      <p className="pl-2 pt-4 pb-4 text-[14px]">{team.name}</p>
      <div className="flex items-center mb-2 font-regular text-[8px]">
        {team.domain && (
          <>
            {team.domain}
            <div className="bg-black rounded-full w-1 h-1 mx-1"></div>
          </>
        )}
        {team.subdomain && (
          <>
            {team.subdomain}
            {team.subdomainTopics?.map((topic, index) => (
              <React.Fragment key={index}>
                <div className="bg-black rounded-full w-1 h-1 mx-1"></div>
                <p>{topic}</p>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsCard;
