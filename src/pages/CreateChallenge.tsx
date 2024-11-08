import { useEffect, useState } from "react";
import TeamNameForm from "../components/CreateChallenge/TeamNameForm";
import Stepper from "../components/Stepper/Stepper";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";
import ChallengeNameForm from "../components/CreateChallenge/ChallengeNameForm";

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: number | null;
}

function CreateChallenge() {
  const [currentStep, setCurrentStep] = useState(1);
  const stepsList = [
    {
      name: "Team",
      complete: false,
    },
    {
      name: "Challenge Name & Due Date",
      complete: false,
    },
    {
      name: "Challenge Description",
      complete: false,
    },
    {
      name: "Challenge Resources",
      complete: false,
    },
    {
      name: "Preview",
      complete: false,
    },
  ];
  const [steps, setSteps] = useState(stepsList);
  const user = useAuthStore((s) => s.user);
  const { data: teamsData, isPending: teamsLoading } = useTeams(user.user_id);

  const [ownedTeams, setOwnedTeams] = useState();
  const [team, setTeam] = useState<Team>();
  const [challengeNameItems, setChallengeNameItems] =
    useState<ChallengeNameItems>({
      challenge_name: "",
      due_date: "",
      difficulty: null,
    });
  useEffect(() => {
    if (teamsData) {
      setOwnedTeams(
        teamsData.filter((team: Team) => team.owner_id === user.user_id),
      );
    }
  }, [teamsData]);

  const getSelectedTeam = (team: Team) => {
    setTeam(team);
  };
  useEffect(() => {}, [getSelectedTeam]);

  const getChallengeNameItems = (
    updatedValues: Partial<typeof challengeNameItems>,
  ) => {
    setChallengeNameItems((prevItems) => ({
      ...prevItems,
      ...updatedValues,
    }));
  };

  const goToPreviousStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 2 ? { ...step, complete: false } : step,
      ),
    );

    setCurrentStep((prev) => Math.min(prev - 1, 1));
  };

  const goToNextStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 1 ? { ...step, complete: true } : step,
      ),
    );

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  return (
    <>
      <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold text-[18px]">
        <p className="mb-8">Challenge Your Team!</p>
        <div className="flex justify-between">
          <div className="p-4 w-2/4">
            <Stepper steps={steps} currentStep={currentStep} lineHeight={50} />
          </div>

          {currentStep == 1 && teamsLoading && (
            <>
              <div className="w-2/4 mt-[300px] ml-[100px]">
                <div className="loading loading-dots loading-md"></div>
              </div>
            </>
          )}

          {!teamsLoading && (
            <div className="w-2/4">
              {currentStep == 1 && ownedTeams && (
                <TeamNameForm
                  teams={ownedTeams}
                  handleTeamChange={getSelectedTeam}
                  selectedTeam={team}
                  goToNextStep={goToNextStep}
                />
              )}

              {currentStep == 2 && (
                <>
                  <ChallengeNameForm
                    challengeNameItems={challengeNameItems}
                    handleChallengeNameChange={getChallengeNameItems}
                    goToNextStep={goToNextStep}
                    goToPreviousStep={goToPreviousStep}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateChallenge;
