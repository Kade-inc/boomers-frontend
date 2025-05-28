import Modal from "react-modal";
import { XCircleIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { useDeleteSolution } from "../../hooks/ChallengeSolution/useDeleteSolution";
import { useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  solutionId: string;
  setSolutionDeleted: (value: boolean) => void;
};

const DeleteSolutionModal = ({
  isOpen,
  onClose,
  challengeId,
  solutionId,
  setSolutionDeleted,
}: ModalTriggerProps) => {
  const deleteSolutionMutation = useDeleteSolution();
  const queryClient = useQueryClient();
  // const navigate = useNavigate()
  const handleDeleteSolution = async () => {
    await deleteSolutionMutation.mutateAsync(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
      },
      {
        onSuccess: () => {
          toast.success("Solution deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["challenge-solutions", challengeId],
          });
          setSolutionDeleted(true);
          onClose();
        },
        onError: (error) => {
          alert(error.message);
          toast.error("Error deleting solution");
        },
      },
    );
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
              Are you sure you want to delete this solution?
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
                disabled={deleteSolutionMutation.isPending}
                onClick={handleDeleteSolution}
              >
                {!deleteSolutionMutation.isPending && <span>Delete</span>}
                {deleteSolutionMutation.isPending && (
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

export default DeleteSolutionModal;
