import { useEffect, useState } from "react";
import TeamNameForm from "../components/CreateTeam/TeamNameForm";
import Stepper from "../components/Stepper/Stepper";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";

function CreateChallenge() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Step 1", "Step 2", "Step 3", "Step 4"];
  const refactoredSteps = [
    {
      name: "Step 1",
      complete: false,
    },
    {
      name: "Step 2",
      complete: false,
    },
    {
      name: "Step 3",
      complete: false,
    },
    {
      name: "Step 4",
      complete: false,
    },
  ];
  const [stepsState, setStepsState] = useState(refactoredSteps);
  const user = useAuthStore((s) => s.user);
  const { data: teamsData, isPending: teamsLoading } = useTeams(user.user_id);

  const [ownedTeams, setOwnedTeams] = useState();
  const [team, setTeam] = useState<Team>();
  // const [errors, setErrors] = useState({
  //     teamError: true,
  //     challengeNameError: true,
  //     challengeDescriptionError: true,
  //     challengeResourcesError: true,
  // })
  const [currentStepError, setCurrentStepError] = useState(true);
  const [currentStepComplete, setCurrentStepComplete] = useState(false);
  useEffect(() => {
    if (teamsData) {
      setOwnedTeams(
        teamsData.filter((team: Team) => team.owner_id === user.user_id),
      );
    }
  }, [teamsData]);

  const getSelectedTeam = (team: Team) => {
    // setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     teamError: false,
    // }));
    setCurrentStepError(false);
    setTeam(team);
  };
  useEffect(() => {}, [getSelectedTeam]);

  const goToPreviousStep = () => {
    console.log("current: ", currentStep);
    setCurrentStep((prev) => Math.min(prev - 1, 1));
    if (currentStep === 2) {
      if (!team) {
        setCurrentStepError(false);
      }
    }
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    setCurrentStepError(true);
    setCurrentStepComplete(false);

    setStepsState((prevSteps) =>
      prevSteps.map((step) =>
        step.name === "Step 1" ? { ...step, complete: true } : step,
      ),
    );
  };

  return (
    <>
      <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold text-[18px]">
        <p className="mb-8">Challenge Your Team!</p>
        <div className="flex justify-between">
          <div className="p-4 w-1/4">
            <Stepper
              steps={stepsState}
              currentStep={currentStep}
              lineHeight={50}
              currentStepComplete={currentStepComplete}
            />
            <div className="mt-4">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="px-4 py-2 mr-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                disabled={currentStep === steps.length || currentStepError}
                className="px-4 py-2 bg-yellow text-darkgrey rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="w-2/4 mt-[300px] ml-50">
            {currentStep == 1 && teamsLoading && (
              <>
                <div className="loading loading-dots loading-md"></div>
              </>
            )}
          </div>

          {currentStep == 1 && ownedTeams && (
            <>
              <div className="w-3/4">
                <TeamNameForm
                  teams={ownedTeams}
                  handleTeamChange={getSelectedTeam}
                  selectedTeam={team}
                />
              </div>
            </>
          )}

          {currentStep == 2 && (
            <>
              <p>Team t</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateChallenge;
