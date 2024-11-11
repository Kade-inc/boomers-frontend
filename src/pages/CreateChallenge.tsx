import { useEffect, useState } from "react";
import TeamNameForm from "../components/CreateChallenge/TeamNameForm";
import Stepper from "../components/Stepper/Stepper";
import useAuthStore from "../stores/useAuthStore";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";
import ChallengeNameForm from "../components/CreateChallenge/ChallengeNameForm";
import useChallenges from "../hooks/useChallenges";
import ChallengeDraftModal from "../components/Modals/ChallengeDraftModal";
import toast, { Toaster } from "react-hot-toast";
import useCreateChallengeStore from "../stores/useCreateChallengeStore";
import DescriptionForm from "../components/CreateChallenge/DescriptionForm";

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
      name: "Challenge Resources",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("draft");
  const [draftsDeleted, setDraftsDeleted] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );

  const user = useAuthStore((s) => s.user);
  const { draftUserChallenges, setDraftUserChallenges } =
    useCreateChallengeStore();

  const { data: teamsData, isPending: teamsLoading } = useTeams(user.user_id);
  const { data: draftChallenges } = useChallenges(user.user_id, false);

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

  const goToPreviousStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 2 ? { ...step, complete: false } : step,
      ),
    );

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToNextStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step, index) =>
        index === currentStep - 1 ? { ...step, complete: true } : step,
      ),
    );

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCreateChallenge = () => {
    if (draftChallenges.length > 4) {
      setModalAction("delete");
    } else {
      closeModal();
    }
  };

  const handleDraftsDeleted = () => {
    setDraftsDeleted(true);
  };
  const handleSelectChallenge = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
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
              background: "#1AC171",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#D92D2D",
            },
          },
        }}
      />
      {draftChallenges && draftChallenges.length > 0 && (
        <ChallengeDraftModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalData={draftChallenges}
          modalAction={modalAction}
          handleCreateChallenge={handleCreateChallenge}
          onDraftsDeleted={handleDraftsDeleted}
          onSelectChallenge={handleSelectChallenge}
        />
      )}
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

              {currentStep == 3 && (
                <>
                  <DescriptionForm
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
