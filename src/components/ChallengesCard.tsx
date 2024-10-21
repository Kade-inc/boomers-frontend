import { LuClock2 } from "react-icons/lu";
import Challenge from "../entities/Challenge";

interface ChallengesCardProps {
  challenge: Challenge;
}

const ChallengesCard: React.FC<ChallengesCardProps> = ({ challenge }) => {
  const { challenge_name, owner_id, team_id, difficulty, due_date } = challenge;

  // Calculate the remaining days
  const calculateDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDiff = due.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const daysLeft = calculateDaysLeft(due_date);

  return (
    <div className="card bg-gradient-to-b from-[#313232] to-[#444c4c] text-white w-[450px] h-[200px] rounded-[3px] font-body">
      <div className="card-body flex flex-col justify-between h-full">
        <div className="flex justify-between w-full items-center">
          <h2 className="font-medium">{challenge_name}</h2>
          <p className="text-right text-[12px]">{owner_id}</p>
        </div>

        <div className="flex justify-between w-full mt-auto">
          <div className="flex-grow text-[12px]">
            <div>
              <h2>{team_id}</h2>
            </div>
            <div>
              {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
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
