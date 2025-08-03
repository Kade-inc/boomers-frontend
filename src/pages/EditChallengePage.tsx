import { useEffect, useState, useMemo } from "react";
import Stepper from "../components/Stepper/Stepper";
import Team from "../entities/Team";
import { Toaster } from "react-hot-toast";
import Challenge from "../entities/Challenge";
import ChallengesCard from "../components/ChallengesCard";
import useUpdateChallenge from "../hooks/Challenges/useUpdateChallenge";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import useChallenge from "../hooks/Challenges/useChallenge";
import EditChallengeNameForm from "../components/EditChallenge/EditChallengeNameForm";
import EditDescriptionForm from "../components/EditChallenge/EditDescriptionForm";
import EditChallengePreview from "../components/EditChallenge/EditChallengePreview";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
  currentStep?: number;
};

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: string;
}

function EditChallengePage() {
  const stepsList = [
    {
      name: "Challenge Name & Due Date",
      complete: false,
    },
    {
      name: "Challenge Description",
      complete: false,
    },
    {
      name: "Preview",
      complete: false,
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(stepsList);
  const [challengeNameItems, setChallengeNameItems] =
    useState<ChallengeNameItems>({
      challenge_name: "",
      due_date: "",
      difficulty: "",
    });

  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [updatedChallenge, setUpdatedChallenge] = useState<ExtendedChallengeInterface>();

  const navigate = useNavigate();

  const { challengeId } = useParams<{ challengeId: string }>();
  const updateChallengeMutation = useUpdateChallenge();
  const { data: fetchedChallenge, isPending: challengePending } = useChallenge(
    challengeId || "",
  );

  // Compute team object from fetched challenge
  const team = useMemo<Team | undefined>(() => {
    if (fetchedChallenge) {
      return {
        _id: fetchedChallenge.team_id,
        owner_id: fetchedChallenge.owner_id,
        name: fetchedChallenge.teamName || "",
      };
    }
    return undefined;
  }, [fetchedChallenge]);

  const getChallengeNameItems = (
    updatedValues: Partial<typeof challengeNameItems>,
  ) => {
    setChallengeNameItems((prevItems) => ({
      ...prevItems,
      ...updatedValues,
    }));
  };

  const getDescription = (description: string) => {
    setDescription(description);
  };
  
  const goToPreviousStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 2 ? { ...step, complete: false } : step,
      ),
    );

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToNextStep = async () => {
    if (currentStep === 3) {
      const updatedChallengeData = await updateChallengeMutation.mutateAsync({
        challengeId: fetchedChallenge?._id || "",
        teamId: fetchedChallenge?.team_id || "",
        payload: {
          challenge_name: challengeNameItems.challenge_name,
          due_date: challengeNameItems.due_date,
          difficulty: Number(challengeNameItems.difficulty),
          description: description,
        },
      });

      setIsCompleted(true);
      setUpdatedChallenge(updatedChallengeData);
    }

    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 1 ? { ...step, complete: true } : step,
      ),
    );

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  // Initialize form data when challenge loads
  useEffect(() => {
    if (fetchedChallenge) {
      setChallengeNameItems({
        challenge_name: fetchedChallenge.challenge_name || "",
        due_date: fetchedChallenge.due_date || "",
        difficulty:
          fetchedChallenge.difficulty !== null ? String(fetchedChallenge.difficulty) : "",
      });
      setDescription(fetchedChallenge.description || "");
      const extendedChallenge = fetchedChallenge as ExtendedChallengeInterface;
      const stepIndex = extendedChallenge.currentStep ? extendedChallenge.currentStep - 1 : 0;
      setCurrentStep(extendedChallenge.currentStep || 1);

      // Update steps state, marking previous steps as complete
      const updatedSteps = stepsList.map((step, index) => ({
        ...step,
        complete: index < stepIndex, // Set complete to true for steps before currentStep
      }));

      setSteps(updatedSteps);
    }
  }, [fetchedChallenge]);

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: "#D92D2D",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#D92D2D",
            },
          },
        }}
      />

      {!isCompleted && (
        <>
          {challengePending && (
            <>
              <div className="flex justify-center">
                <div className=" mt-[300px] h-full">
                  <div className="loading loading-dots loading-md"></div>
                </div>
              </div>
            </>
          )}
          {!challengePending && fetchedChallenge && (
            <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold text-[18px]">
              <p className="mb-8 text-[20px] font-bold text-base-300">
                Edit Challenge
              </p>

              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:p-4 md:w-2/4">
                  <Stepper
                    steps={steps}
                    currentStep={currentStep}
                    lineHeight={50}
                  />
                </div>

                <div
                  className={`${currentStep === 2 || currentStep === 3 ? "md:w-2/4 lg:w-3/4" : "md:w-2/4"} mt-4 md:mt-0`}
                >
                  {currentStep == 1 && (
                    <EditChallengeNameForm
                      challengeNameItems={challengeNameItems}
                      handleChallengeNameChange={getChallengeNameItems}
                      goToNextStep={goToNextStep}
                      goToPreviousStep={goToPreviousStep}
                      teamId={team?._id || ""}
                    />
                  )}

                  {currentStep == 2 && (
                    <EditDescriptionForm
                      handleDescriptionChange={getDescription}
                      teamId={team?._id || ""}
                      description={description}
                      goToNextStep={goToNextStep}
                      goToPreviousStep={goToPreviousStep}
                    />
                  )}
                  {currentStep == 3 && (
                    <EditChallengePreview
                      goToNextStep={goToNextStep}
                      goToPreviousStep={goToPreviousStep}
                      challengeNameItems={challengeNameItems}
                      description={description}
                      isPending={updateChallengeMutation.isPending}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {isCompleted && updatedChallenge && (
        <>
          <div className="flex flex-col items-center pt-40 text-base-content font-body h-screen bg-base-100">
            <CheckCircleIcon height={80} width={80} fill={"#4AC565"} />
            <ChallengesCard
              challenge={updatedChallenge}
              styles={"w-[350px] h-[190px] mt-8"}
            />
            <p className="mt-8 font-semibold">
              Challenge updated successfully!
            </p>
            <button
              className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4"
              onClick={() => navigate(`/challenge/${fetchedChallenge?._id}`)}
            >
              View Challenge
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default EditChallengePage;
