import React from "react";

// Fix this. We should use the Team entity instead of having to duplicate whatever is in the team
// entity and just changing subdomain and subdomainTopics
interface UserDetailsCardProps {
  team: {
    _id?: string;
    owner_id?: string;
    name: string;
    teamUsername?: string;
    domain?: string;
    subdomain?: string;
    subdomainTopics?: string[];
    createdAt?: string;
    updatedAt?: string;
    _v?: number;
    teamColor?: string;
  };
  styles?: string;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ team, styles }) => {
  return (
    <div
      className={`card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white p-3 font-body rounded-[3px] ${styles} h-[94px] mr-1 flex justify-center`}
    >
      <p className="pb-4 text-[14px]">{team.name}</p>
      <div className="flex items-center font-medium text-[8px]">
        {team.domain && (
          <>
            {team.domain}
            <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
          </>
        )}
        {team.subdomain && (
          <>
            {team.subdomain}
            {team?.subdomainTopics && team.subdomainTopics.length > 0 && (
              <>
                <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                <div
                  className={`${
                    team.subdomainTopics.length > 1
                      ? "tooltip tooltip-top tooltip-warning"
                      : ""
                  }`}
                  data-tip={team.subdomainTopics.join(", ")}
                >
                  {team.subdomainTopics[0]}
                  {team.subdomainTopics.length > 1 &&
                    ` +${team.subdomainTopics.length - 1}`}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsCard;
