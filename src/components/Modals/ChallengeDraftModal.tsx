import Modal from "react-modal";
import Challenge from "../../entities/Challenge";
import ChallengesSlimCard from "../Cards/ChallengeSlimCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useDeleteChallenges from "../../hooks/useDeleteChallenges";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  modalData: Challenge[];
  handleCreateChallenge: () => void;
  modalAction: string;
  onDraftsDeleted: () => void;
  onSelectChallenge: (challengeId: string) => void;
};

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};

function ChallengeDraftModal({
  isOpen,
  onClose,
  modalData,
  handleCreateChallenge,
  modalAction,
  onDraftsDeleted,
  onSelectChallenge,
}: ModalTriggerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const mutation = useDeleteChallenges();
  const navigate = useNavigate();

  // Trimmed search term to avoid spaces-only input
  const trimmedSearchTerm = searchTerm.trim();

  // Filter challenges based on trimmed searchTerm
  const filteredData = trimmedSearchTerm
    ? modalData.filter(
        (challenge: ExtendedChallengeInterface) =>
          challenge.teamName
            ?.toLowerCase()
            .includes(trimmedSearchTerm.toLowerCase()) ||
          (challenge.challenge_name &&
            challenge.challenge_name
              .toLowerCase()
              .includes(trimmedSearchTerm.toLowerCase())),
      )
    : modalData; // Show all challenges if searchTerm is empty

  const [selectedChallengeIds, setSelectedChallengeIds] = useState<string[]>(
    [],
  );

  const deleteDrafts = async () => {
    const payload = {
      challengeIds: selectedChallengeIds,
    };

    await mutation.mutateAsync(payload);
    onDraftsDeleted();
  };

  const handleAction = () => {
    if (modalAction === "delete") {
      deleteDrafts();
    } else {
      handleCreateChallenge();
    }
  };

  // Function to add a team to the selectedTeams array
  const addTeam = (challengeId: string) => {
    setSelectedChallengeIds((prevselectedChallengeIds) => {
      // Check if the ID is already in the selectedChallengeIds array
      const isSelected = prevselectedChallengeIds.includes(challengeId);

      // If selected, remove it; otherwise, add it
      if (isSelected) {
        return prevselectedChallengeIds.filter((id) => id !== challengeId);
      } else {
        return [...prevselectedChallengeIds, challengeId];
      }
    });
  };

  const handleCardClick = (challengeId: string) => {
    if (modalAction === "delete") {
      addTeam(challengeId);
    } else {
      onSelectChallenge(challengeId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-[#00000033]"
    >
      <div className=" rounded-lg shadow-lg w-[90%] md:max-w-4xl mx-auto h-[80vh] top-[5vh] overflow-y-auto relative mb-14 px-4 md:px-[80px] py-10 bg-base-100 text-base-content font-body">
        <div>
          <div className="relative mt-5">
            <div
              className={`absolute bottom-0 top-8 left-3 transform -translate-x-1/2 w-6 h-[6px] rounded ${modalAction === "delete" ? "bg-error" : "bg-base-content"} `}
            ></div>
            <p
              className={`font-bold text-[20px] ${modalAction === "delete" ? "text-error" : ""}`}
            >
              {modalAction === "delete" ? (
                <span>Delete Draft</span>
              ) : (
                <span>Your Drafts</span>
              )}
            </p>
          </div>

          <p className="mt-8 mb-4">
            {modalAction === "delete" ? (
              <span>
                You have reached the maximum of{" "}
                <span className="font-bold">5</span> draft challenges. Delete
                one or more drafts in order to create a new challenge.
              </span>
            ) : (
              <span>
                {" "}
                You have the following draft challenges. Choose one to complete
                it&apos;s creation.
              </span>
            )}
          </p>
          <label className="input input-bordered flex items-center gap-2 mb-8 md:hidden flex">
            <input
              type="text"
              className="grow focus:border-yellow-500 focus:ring-yellow-500"
              placeholder="Search by challenge or team name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          {modalAction === "delete" && (
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#D92D2D"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>

              <p className="ml-2 text-error font-semibold text-[14px]">
                Click on a draft to select it for deletion.
              </p>
            </div>
          )}
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredData.map((challenge) => (
                <ChallengesSlimCard
                  key={challenge._id}
                  challenge={challenge}
                  styles="h-[130px] w-[350px] cursor-pointer"
                  page="create-team"
                  handleClick={() => handleCardClick(challenge._id)}
                  isSelected={selectedChallengeIds.includes(challenge._id)}
                  isDeleting={mutation.isPending}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-base-content mt-8 h-44">
              No drafts matching{" "}
              <span className="font-bold text-yellow">
                &apos;{searchTerm}&apos;
              </span>{" "}
              found.
            </p>
          )}

          <div className="flex justify-end  items-center mt-30 absolute bottom-[10%] right-[12%]">
            <button
              className="btn bg-black rounded-md text-white font-medium border-none hover:bg-error"
              onClick={() => navigate("/")}
            >
              Quit
            </button>
            <button
              className={`btn  rounded-md font-medium  ml-6 ${modalAction === "delete" ? "bg-error text-white hover:bg-error" : "hover:bg-yellow bg-yellow text-darkgrey "}`}
              onClick={handleAction}
              disabled={
                (modalAction === "delete" &&
                  selectedChallengeIds.length === 0) ||
                mutation.isPending
              }
            >
              {modalAction === "delete" && !mutation.isPending && (
                <span>Delete</span>
              )}
              {modalAction === "draft" && <span>Create new challenge</span>}
              {mutation.isPending && (
                <span className="loading loading-dots loading-md"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ChallengeDraftModal;
