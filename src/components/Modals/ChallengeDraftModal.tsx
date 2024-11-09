import Modal from "react-modal";
import Challenge from "../../entities/Challenge";
import ChallengesSlimCard from "../Cards/ChallengeSlimCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  modalData: Challenge[];
};

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};

function ChallengeDraftModal({
  isOpen,
  onClose,
  modalData,
}: ModalTriggerProps) {
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-[#00000033]"
    >
      <div className=" rounded-lg shadow-lg w-[90%] md:max-w-4xl mx-auto h-[80vh] top-[5vh] overflow-y-auto relative mb-14 px-4 md:px-[80px] py-10 bg-base-100 text-base-content font-body">
        <div>
          <div className="relative mt-5">
            <div className="absolute bottom-0 top-8 left-3 transform -translate-x-1/2 w-6 h-[6px] bg-base-content rounded "></div>
            <p className="font-bold text-[20px] ">Your Drafts</p>
          </div>

          <p className="mt-8 mb-8">
            You have the following draft challenges. Choose one to complete
            it&apos;s creation.
          </p>
          <label className="input input-bordered flex items-center gap-2 mb-8">
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
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredData.map((challenge) => (
                <ChallengesSlimCard
                  key={challenge._id}
                  challenge={challenge}
                  styles="h-[130px] w-[350px] cursor-pointer"
                  page="create-team"
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

          <div className="flex justify-end  items-center mt-48">
            <button
              className="btn bg-error rounded-md text-white font-medium border-none hover:bg-error"
              onClick={() => navigate("/")}
            >
              Quit
            </button>
            <button
              className="btn bg-yellow rounded-md text-darkgrey font-medium hover:bg-yellow ml-6"
              onClick={onClose}
            >
              Create new challenge
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ChallengeDraftModal;
