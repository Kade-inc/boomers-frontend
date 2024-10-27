import Team from "../entities/Team";
import useAuthStore from "../stores/useAuthStore";

type ExtendedTeamInterface = Team & {
  subdomainTopics?: string[];
};

interface TeamProps {
  team: ExtendedTeamInterface;
  styles?: string;
  section?: string;
  onClick: () => void;
}
const TeamCard = ({ team, styles, section, onClick }: TeamProps) => {
  const { user } = useAuthStore.getState();

  return (
    <>
      <div
        key={team._id}
        className={`card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white h-[200px] rounded-[3px] font-body cursor-pointer ${styles}`}
        style={{ background: team?.teamColor }}
        onClick={onClick}
      >
        <div className="card-body py-4 justify-between">
          <div className="flex justify-between w-full items-center">
            <h2 className="font-medium">{team.name}</h2>
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
            <div className="flex-grow text-[12px]">
              {team && (
                <>
                  <div className="flex items-center mb-2 font-medium">
                    {team.domain}
                    <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                    {team.subdomain}
                    <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                    {team?.subdomainTopics && (
                      <>
                        {team.subdomainTopics[0]}
                        {team.subdomainTopics.length - 1 > 0 &&
                          ` +${team.subdomainTopics.length - 1}`}
                      </>
                    )}
                  </div>
                  <div>Active</div>
                </>
              )}
            </div>
            {/* <div className="flex mt-[-20px] mr-2.5">
                <h2 className="font-normal rotate-[-90deg] origin-top-right whitespace-nowrap">
                  5 Members
                </h2>
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamCard;
