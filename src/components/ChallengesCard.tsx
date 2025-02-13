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
  isDeleteMode?: boolean;
  isSelected?: boolean;
  onCardClick?: (challengeId: string) => void;
}

const ChallengesCard: React.FC<ChallengesCardProps> = ({
  challenge,
  teamsInformation,
  styles,
  isDeleteMode,
  isSelected,
  onCardClick,
}) => {
  const { challenge_name, owner_id, difficulty, due_date } = challenge;
  const { user } = useAuthStore.getState();
  const [updatedChallenge, setUpdatedChallenge] = useState(challenge);

  useEffect(() => {
    if (teamsInformation && challenge.team_id) {
      const team = teamsInformation.find(
        (team) => team._id === challenge.team_id,
      );
      if (team)
        setUpdatedChallenge({ ...updatedChallenge, teamName: team.name });
    }
  }, [teamsInformation, challenge.team_id]);

  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = due_date ? calculateDaysLeft(due_date) : null;
  const difficultyValue = difficulty ?? 1;

  return (
    <div
      className={`card bg-gradient-to-b from-[#313232] to-[#444c4c] text-white rounded-[3px] font-body ${styles} ${
        isSelected ? "border-2 border-red-500" : ""
      } ${isDeleteMode ? "bg-red-500" : ""} hover:cursor-pointer w-[200px]`}
      onClick={() => onCardClick?.(challenge._id)}
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
            <h2>{updatedChallenge.teamName || ""}</h2>
            <div>
              {
                ["Easy", "Medium", "Hard", "Very Hard", "Legendary"][
                  difficultyValue - 1
                ]
              }
            </div>
          </div>
          <div className="flex items-end">
            <h2 className="flex items-center text-center text-[12px] gap-x-2">
              {daysLeft && daysLeft > 0 ? (
                <>
                  <LuClock2 /> {daysLeft} days left
                </>
              ) : (
                <span>Expired</span>
              )}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesCard;
