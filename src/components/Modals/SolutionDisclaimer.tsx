import Modal from "react-modal";
import usePostChallengeSolution from "../../hooks/ChallengeSolution/usePostChallengeSolution";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
};

const SolutionDisclaimer = ({
  isOpen,
  onClose,
  challengeId,
}: ModalTriggerProps) => {
  const { mutate: postSolution, isPending: postSolutionIsPending } =
    usePostChallengeSolution();
  const navigate = useNavigate();
  const handlePostSolution = () => {
    postSolution(
      { challengeId },
      {
        onSuccess: (response) => {
          onClose();
          navigate(`/challenge/${challengeId}/solution/${response._id}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg py-10 px-2 md:px-8 w-[95%] md:w-[500px]"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30 flex items-center justify-center"
      >
        <div className="absolute top-2 right-3 flex justify-end w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D92D2D"
            className="size-8 cursor-pointer"
            onClick={onClose}
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="font-body flex flex-col items-center">
          <ul className="list-disc w-3/4 mx-auto font-medium text-base-content">
            <li>
              Before you begin, you will have to give the steps you will take to
              do the challenge.
            </li>
            <li>
              Noting down your action plan is one of the great things that makes
              developers great.
            </li>
            <li>
              The steps will be used to track your progress and your mentor will
              review the steps.
            </li>
          </ul>
          <button
            className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-md mt-4 w-[80%] font-medium text-[16px]"
            onClick={handlePostSolution}
          >
            {postSolutionIsPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Proceed"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SolutionDisclaimer;
