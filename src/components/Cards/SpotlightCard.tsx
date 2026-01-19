import Team from "../../entities/Team";
import useAuthStore from "../../stores/useAuthStore";

type ExtendedTeamInterface = Team & {
  subdomainTopics?: string[];
};

interface TeamProps {
  team: ExtendedTeamInterface;
  styles?: string;
  section?: string;
  onClick?: () => void;
  name?: string;
  domain?: string;
  subDomain?: string;
  subStyles?: string;
}
const SpotlightCard = ({
  team,
  styles,
  section,
  onClick,
  name,
  domain,
  subDomain,
  subStyles,
}: TeamProps) => {
  const { user } = useAuthStore.getState();

  return (
    <>
      <div
        className={`card from-[#005E78] to-[#00989B] text-white rounded-[3px] font-body cursor-pointer ${styles}`}
        style={{ background: team?.teamColor }}
        onClick={onClick}
      >
        <div className={`card-body py-4 px-4 justify-between ${subStyles}`}>
          <div className="flex justify-between w-full">
            <h2 className="font-medium w-[85%] break-words">
              {team.name || name}
            </h2>
            {section === "dashboard-section" && (
              <>
                {team.owner_id === user.user_id && (
                  <p className="text-right text-[12px]">Owner</p>
                )}
                {team.owner_id !== user.user_id && (
                  <p className="text-right text-[12px]">Member</p>
                )}
              </>
            )}
            {section === "allTeams-section" && (
              <>
                {team.owner_id === user.user_id && (
                  <p className="text-right text-[12px]">Owner</p>
                )}
              </>
            )}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-grow text-[10px]">
              {team && (
                <>
                  <div className="flex items-center mb-2 font-medium">
                    {team?.domain || domain}

                    {(team?.subDomain || subDomain) && (
                      <>
                        <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                        {team?.subDomain || subDomain}
                      </>
                    )}

                    {team?.subdomainTopics &&
                      team.subdomainTopics.length > 0 && (
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
                  </div>
                  {(team.name || name?.trim()) && <div>Active</div>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotlightCard;
