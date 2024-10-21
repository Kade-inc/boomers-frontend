import { useNavigate } from "react-router-dom";
import Team from "../entities/Team";

interface TeamProps {
  team: Team;
  styles: string;
}
const TeamCard = ({ team, styles }: TeamProps) => {
  console.log("TEAM: ", team);
  const navigate = useNavigate();

  return (
    <>
      <div
        key={team._id}
        className={`card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white h-[200px] rounded-[3px] font-body cursor-pointer ${styles}`}
        style={{ background: team?.teamColor }}
        onClick={() => {
          navigate(`/teams/${team._id}`);
        }}
      >
        <div className="card-body py-4 justify-between">
          <div className="flex justify-between w-full items-center">
            <h2 className="font-medium">{team.name}</h2>
            {/* <p className="text-right text-[12px]">Member</p> */}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex-grow text-[12px]">
              <div className="flex items-center mb-2 font-medium">
                {team.domain}{" "}
                <div className="bg-white rounded-full w-1 h-1 mx-1"></div>{" "}
                {team.subdomain}{" "}
                <div className="bg-white rounded-full w-1 h-1 mx-1"></div>{" "}
                {team.subdomainTopics[0]}{" "}
                {team.subdomainTopics.length - 1 > 0 &&
                  `+${team.subdomainTopics.length - 1}`}
              </div>
              <div>Very Active</div>
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
