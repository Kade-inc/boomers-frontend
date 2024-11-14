import { useEffect, useState } from "react";
import TeamNameForm from "../components/CreateChallenge/TeamNameForm";
import Stepper from "../components/Stepper/Stepper";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";
import ChallengeNameForm from "../components/CreateChallenge/ChallengeNameForm";
import ChallengeDraftModal from "../components/Modals/ChallengeDraftModal";
import toast, { Toaster } from "react-hot-toast";
import useCreateChallengeStore from "../stores/useCreateChallengeStore";
import DescriptionForm from "../components/CreateChallenge/DescriptionForm";
import useCreateChallenge from "../hooks/Challenges/useCreateChallenge";
import Challenge from "../entities/Challenge";
import useChallenges from "../hooks/Challenges/useChallenges";
import ResourcesForm from "../components/CreateChallenge/ResourcesForm";
import ChallengesCard from "../components/ChallengesCard";
import useUpdateChallenge from "../hooks/Challenges/useUpdateChallenge";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: string;
}

function CreateChallenge() {
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
      name: "Preview",
      complete: false,
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(stepsList);
  const [ownedTeams, setOwnedTeams] = useState();
  const [team, setTeam] = useState<Team>();
  const [challengeNameItems, setChallengeNameItems] =
    useState<ChallengeNameItems>({
      challenge_name: "",
      due_date: "",
      difficulty: "",
    });

  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("draft");
  const [draftsDeleted, setDraftsDeleted] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [challenge, setChallenge] = useState<ExtendedChallengeInterface>();

  const user = useAuthStore((s) => s.user);
  const {
    draftUserChallenges,
    selectedTeams,
    setDraftUserChallenges,
    setCurrentEditingChallenge,
    setSelectedTeams,
  } = useCreateChallengeStore();

  const { data: teamsData, isPending: teamsLoading } = useTeams(user.user_id);
  const { data: draftChallenges } = useChallenges(user.user_id, false);
  const createChallengeMutation = useCreateChallenge();
  const updateChallengeMutation = useUpdateChallenge();

  const getSelectedTeam = (team: Team) => {
    setTeam(team);
  };

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
    if (currentStep === 1) {
      const teamFound = selectedTeams.find(
        (selectedTeam) => selectedTeam._id === team?._id,
      );

      if (!teamFound) {
        try {
          const response = await createChallengeMutation.mutateAsync(
            team?._id || "",
          );

          if (!response) {
            return;
          }

          const currentDraftUserChallenges = [...draftUserChallenges];
          currentDraftUserChallenges.push(response);
          // Add challenge to global draftUserChallenges when created
          setDraftUserChallenges(currentDraftUserChallenges);

          const newTeams = [...selectedTeams];
          if (team) newTeams.push(team);
          setSelectedTeams(newTeams);
        } catch (error: unknown) {
          // Type guard to check if error is an instance of Error
          if (error instanceof Error) {
            if (
              error.message ===
              "Error: Maximum amount of drafts reached. Please delete some of your draft challenges before you proceed."
            ) {
              setModalAction("delete");
              setIsModalOpen(true);
              return;
            }
          } else {
            console.error("An unexpected error occurred:", error);
          }
        }
      }
    } else if (currentStep === 4) {
      const createdChallenge = await updateChallengeMutation.mutateAsync({
        challengeId: selectedChallengeId || "",
        teamId: team?._id || "",
        payload: {
          valid: true,
        },
      });

      setIsCompleted(true);
      setChallenge(createdChallenge);
    }

    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 1 ? { ...step, complete: true } : step,
      ),
    );

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCreateChallenge = () => {
    if (draftUserChallenges.length > 4) {
      setModalAction("delete");
    } else {
      closeModal();
    }
  };

  const handleDraftsDeleted = () => {
    setDraftsDeleted(true);
  };
  const handleSelectChallenge = (challenge: ExtendedChallengeInterface) => {
    const team: Team = {
      _id: challenge.team_id,
      name: challenge.teamName || "",
    };
    setSelectedTeams([team]);
    setSelectedChallengeId(challenge._id);
  };

  useEffect(() => {
    if (teamsData) {
      setOwnedTeams(
        teamsData.filter((team: Team) => team.owner_id === user.user_id),
      );
    }
  }, [teamsData]);

  useEffect(() => {
    if (draftChallenges) {
      setDraftUserChallenges(draftChallenges);
      setIsModalOpen(true);
    }
  }, [draftChallenges]);

  useEffect(() => {
    if (draftsDeleted) {
      toast.success("Draft(s) deleted successfully.", {
        duration: 4000,
      });
      setDraftsDeleted(false);
      setIsModalOpen(false);
    }
  }, [draftsDeleted]);

  useEffect(() => {
    const challenge = draftUserChallenges.find(
      (challenge) => challenge._id === selectedChallengeId,
    );
    if (challenge) {
      setCurrentEditingChallenge(challenge);
      const team = {
        _id: challenge.team_id,
        owner_id: challenge.owner_id,
        name: challenge.teamName || "",
      };
      setTeam(team);
      setChallengeNameItems({
        challenge_name: challenge.challenge_name || "",
        due_date: challenge.due_date || "",
        difficulty:
          challenge.difficulty !== null ? String(challenge.difficulty) : "",
      });
      setDescription(challenge.description || "");
      const stepIndex = challenge.currentStep ? challenge.currentStep - 1 : 0;
      setCurrentStep(challenge.currentStep || 1);

      // Update steps state, marking previous steps as complete
      const updatedSteps = stepsList.map((step, index) => ({
        ...step,
        complete: index < stepIndex, // Set complete to true for steps before currentStep
      }));

      setSteps(updatedSteps);
    }
  }, [selectedChallengeId]);

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
      {draftUserChallenges && isModalOpen && draftUserChallenges.length > 0 && (
        <ChallengeDraftModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalData={draftUserChallenges}
          modalAction={modalAction}
          handleCreateChallenge={handleCreateChallenge}
          onDraftsDeleted={handleDraftsDeleted}
          onSelectChallenge={handleSelectChallenge}
        />
      )}
      {!isCompleted && (
        <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold text-[18px]">
          <p className="mb-8">Challenge Your Team!</p>
          <div className="flex justify-between">
            <div className="p-4 w-2/4">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                lineHeight={50}
              />
            </div>

            {currentStep == 1 && teamsLoading && (
              <>
                <div className="w-2/4 mt-[300px] ml-[100px]">
                  <div className="loading loading-dots loading-md"></div>
                </div>
              </>
            )}

            {!teamsLoading && (
              <div
                className={`${currentStep === 3 || currentStep === 4 ? "w-3/4" : "w-2/4"}`}
              >
                {currentStep == 1 && ownedTeams && (
                  <TeamNameForm
                    teams={ownedTeams}
                    handleTeamChange={getSelectedTeam}
                    selectedTeam={team}
                    goToNextStep={goToNextStep}
                    isLoading={createChallengeMutation.isPending}
                  />
                )}

                {currentStep == 2 && (
                  <ChallengeNameForm
                    challengeNameItems={challengeNameItems}
                    handleChallengeNameChange={getChallengeNameItems}
                    goToNextStep={goToNextStep}
                    goToPreviousStep={goToPreviousStep}
                    selectedChallengeId={selectedChallengeId || ""}
                    teamId={team?._id || ""}
                  />
                )}

                {currentStep == 3 && (
                  <DescriptionForm
                    handleDescriptionChange={getDescription}
                    selectedChallengeId={selectedChallengeId || ""}
                    teamId={team?._id || ""}
                    description={description}
                    goToNextStep={goToNextStep}
                    goToPreviousStep={goToPreviousStep}
                  />
                )}
                {currentStep == 4 && (
                  <ResourcesForm
                    goToNextStep={goToNextStep}
                    goToPreviousStep={goToPreviousStep}
                    team={team}
                    challengeNameItems={challengeNameItems}
                    description={description}
                    isPending={updateChallengeMutation.isPending}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {isCompleted && challenge && (
        <>
          <div className="flex flex-col item-center mt-40 text-base-content font-body h-screen">
            <CheckCircleIcon height={80} width={80} fill={"#4AC565"} />
            <ChallengesCard
              challenge={challenge}
              styles={"w-[350px] h-[190px] mt-8"}
            />
            <p className="mt-8 font-semibold">
              Challenge created successfully!
            </p>
            <button className="btn bg-yellow hover:bg-yellow rounded-sm mt-4">
              View Challenge
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default CreateChallenge;
