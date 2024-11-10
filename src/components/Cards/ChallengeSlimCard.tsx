import Challenge from "../../entities/Challenge";
import Team from "../../entities/Team";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
  currentStep?: string;
};
interface ChallengesSlimCardProps {
  challenge: ExtendedChallengeInterface;
  styles?: string;
  section?: string;
  teamsInformation?: Team[];
  page?: string;
  handleClick: () => void;
  isSelected: boolean;
  isDeleting: boolean;
}

const ChallengesSlimCard: React.FC<ChallengesSlimCardProps> = ({
  challenge,
  styles,
  handleClick,
  isSelected,
  isDeleting,
}: ChallengesSlimCardProps) => {
  return (
    <div
      className={`card bg-gradient-to-b from-[#313232] to-[#444c4c] text-white rounded-[3px] font-body ${styles} ${isSelected ? "border-4 border-error" : ""}`}
      onClick={isDeleting ? undefined : handleClick}
    >
      <div className="card-body flex flex-col justify-center px-4">
        <div className="flex justify-between w-full">
          <div className="text-[14px] w-[80%]">
            <div className="mb-2">
              <h2 className="font-semibold">
                {challenge.challenge_name || "Unnamed"}
              </h2>
            </div>
            <div>{challenge.teamName}</div>
          </div>

          <div className="flex items-end">
            <h2 className="flex items-center text-center text-[12px] gap-x-2">
              Step {challenge.currentStep}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesSlimCard;
