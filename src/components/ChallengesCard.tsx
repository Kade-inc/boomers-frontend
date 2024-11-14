import { LuClock2 } from "react-icons/lu";
import Challenge from "../entities/Challenge";
import useAuthStore from "../stores/useAuthStore";
import Team from "../entities/Team";
import { useEffect, useState } from "react";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};
interface ChallengesCardProps {
  challenge: ExtendedChallengeInterface;
  styles?: string;
  section?: string;
  teamsInformation?: Team[];
}

const ChallengesCard: React.FC<ChallengesCardProps> = ({
  challenge,
  teamsInformation,
  styles,
}: ChallengesCardProps) => {
  const { challenge_name, owner_id, difficulty, due_date } = challenge;
  const { user } = useAuthStore.getState();
  const [updatedChallenge, setUpdatedChallenge] = useState(challenge);

  const checkTeamsInformation = () => {
    teamsInformation?.map((team) => {
      if (team._id === challenge.team_id) {
        const newChallenge = { ...updatedChallenge, teamName: team.name };
        setUpdatedChallenge(newChallenge);
      }
    });
  };

  useEffect(() => {
    if (teamsInformation && challenge.team_id) {
      checkTeamsInformation();
    }
  }, [teamsInformation, challenge.team_id]);

  // Calculate the remaining days
  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDiff = due.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const daysLeft = due_date && calculateDaysLeft(due_date);

  return (
    <div
      className={`card bg-gradient-to-b from-[#313232] to-[#444c4c] text-white rounded-[3px] font-body ${styles}`}
    >
      <div className="card-body flex flex-col justify-between h-full py-5">
        <div className="flex justify-between w-full items-center">
          <h2 className="font-medium">{challenge_name}</h2>
          {user.user_id === owner_id && (
            <p className="text-right text-[12px]">Owner</p>
          )}
        </div>

        <div className="flex justify-between w-full mt-auto">
          <div className="flex-grow text-[12px]">
            <div className="mb-2">
              <h2>{updatedChallenge.teamName || ""}</h2>
            </div>
            <div>
              {difficulty === 1 && "Easy"}
              {difficulty === 2 && "Medium"}
              {difficulty === 3 && "Hard"}
              {difficulty === 4 && "Very Hard"}
              {difficulty === 5 && "Legendary"}
            </div>
          </div>
          <div className="flex items-end">
            <h2 className="flex items-center text-center text-[12px] gap-x-2">
              <LuClock2 /> {daysLeft} days left
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesCard;
