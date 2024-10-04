import { useNavigate } from "react-router-dom";
import useTeamStore from "../stores/useTeamStore";
import { useEffect } from "react";
import Team from "../entities/Team";

const TeamCard = () => {
  const navigate = useNavigate();
  const { teams, fetchTeams } = useTeamStore();

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <>
      {teams.map((team: Team) => (
        <div
          key={team._id}
          className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white w-[450px] h-[200px] rounded-[3px] font-body cursor-pointer"
          onClick={() => {
            navigate(`/teams/${team._id}`);
          }}
        >
          <div className="card-body">
            <div className="flex justify-between w-full items-center">
              <h2 className="font-medium">{team.name}</h2>
              <p className="text-right text-[12px]">Member</p>
            </div>
            <div className="flex justify-between w-full mt-[55px]">
              <div className="flex-grow text-[12px]">
                <div>
                  {team.domain} . {team.subdomain} . {team.subdomainTopics}{" "}
                  {team.subdomainTopics.length - 1 > 0 &&
                    `+${team.subdomainTopics.length - 1}`}
                </div>
                <div>Very Active</div>
              </div>
              <div className="flex mt-[-20px] mr-2.5">
                <h2 className="font-normal rotate-[-90deg] origin-top-right whitespace-nowrap">
                  5 Members
                </h2>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TeamCard;
