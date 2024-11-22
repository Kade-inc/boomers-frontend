import Modal from "react-modal";
import { XCircleIcon } from "@heroicons/react/24/solid";
import useDeleteChallenge from "../../hooks/Challenges/useDeleteChallenge";
import { Toaster } from "react-hot-toast";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  challengeId: string;
  setChallengeDeleted: (value: boolean) => void;
};

const DeleteChallengeModal = ({
  isOpen,
  onClose,
  teamId,
  challengeId,
  setChallengeDeleted,
}: ModalTriggerProps) => {
  const deleteChallengeMutation = useDeleteChallenge();

  const handleDeleteChallenge = async () => {
    await deleteChallengeMutation.mutateAsync({
      teamId,
      challengeId,
    });

    setChallengeDeleted(true);
  };
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
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="z-50"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
      >
        <div className="flex justify-end mt-4 mr-8">
          <XCircleIcon
            width={36}
            height={36}
            onClick={onClose}
            color="#D92D2D"
          />
        </div>
        <div className="flex items-center justify-center h-screen ">
          <div className="rounded-lg shadow-lg bg-darkgrey font-body h-[170px] w-[350px] px-4 pt-8 space-y-2">
            <p className="text-white font-normal">
              Are you sure you want to delete this challenge?
            </p>
            <div className="flex items-center justify-center">
              <button
                className="btn btn:ghost bg-yellow hover:bg-yellow border-none mr-2 text-darkgrey"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn:ghost bg-error hover:bg-error border-none ml-2 text-white"
                disabled={deleteChallengeMutation.isPending}
                onClick={handleDeleteChallenge}
              >
                {!deleteChallengeMutation.isPending && <span>Delete</span>}
                {deleteChallengeMutation.isPending && (
                  <span className="loading loading-dots loading-md"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteChallengeModal;
