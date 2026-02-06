import { AiOutlineExclamationCircle } from "react-icons/ai";
import useDeleteTeam from "../../hooks/useDeleteTeam";
import { useState } from "react";
import * as Sentry from "@sentry/react";

interface DeleteTeamDialogProps {
  teamId: string;
}

const DeleteTeamDialog = ({ teamId }: DeleteTeamDialogProps) => {
  const deleteTeam = useDeleteTeam();
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => {
    const modal = document.getElementById(
      "delete_team_modal",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleDeleteTeam = () => {
    setIsDeleting(true);

    deleteTeam.mutate(teamId, {
      onSuccess: () => {
        // Toast and redirect handled in hook, but we can do extra cleanup if needed
        setIsDeleting(false);
        closeModal();
      },
      onError: (error: Error) => {
        setIsDeleting(false);
        Sentry.captureException(error, {
          extra: { context: "Delete team failed" },
        });
      },
    });
  };

  return (
    <>
      <dialog
        id="delete_team_modal"
        className="modal modal-bottom sm:modal-middle font-body"
      >
        <div className="modal-box !p-0 !w-[380px] !rounded-md">
          <AiOutlineExclamationCircle
            size={50}
            color="red"
            style={{ display: "block", margin: "auto", marginTop: "40px" }}
          />
          <h3 className="py-4 text-center px-4">
            Are you sure you want to delete this team? <br />
            <span className="text-sm font-normal">
              This action cannot be undone.
            </span>
          </h3>

          <div
            className="w-full text-white bg-[#14AC91] rounded-none hover:bg-[#14AC91] py-2 flex justify-center cursor-pointer"
            onClick={closeModal}
          >
            Go Back
          </div>
          <button
            className="w-full text-white bg-[#C83A3A] rounded-none hover:bg-[#C83A3A] py-2 flex justify-center cursor-pointer"
            onClick={handleDeleteTeam}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex justify-center">
                <span className="loading loading-dots loading-xs"></span>
              </div>
            ) : (
              "Delete Team"
            )}
          </button>
        </div>
      </dialog>
    </>
  );
};

export default DeleteTeamDialog;
