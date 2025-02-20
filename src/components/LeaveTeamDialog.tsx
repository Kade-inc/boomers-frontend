import { AiOutlineExclamationCircle } from "react-icons/ai";
import useLeaveTeam from "../hooks/useLeaveTeam";
import toast from "react-hot-toast";
import { useState } from "react";

interface LeaveTeamDialogProps {
  teamId: string;
}

const LeaveTeamDialog = ({ teamId }: LeaveTeamDialogProps) => {
  const leaveTeam = useLeaveTeam();
  const [isLeaving, setIsLeaving] = useState(false); // Loading state

  // Close modal
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_5",
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleLeaveTeam = () => {
    setIsLeaving(true); // Start loading

    leaveTeam.mutate(teamId, {
      onSuccess: () => {
        toast.success("Successfully left the team!");
        setIsLeaving(false); // Stop loading
        closeModal(); // Close the modal
      },
      onError: (error: Error) => {
        toast.error(`Failed to leave the team: ${error.message}`);
        setIsLeaving(false); // Stop loading on error
      },
    });
  };

  return (
    <>
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle font-body"
      >
        <div className="modal-box !p-0 !w-[380px] !rounded-md">
          <AiOutlineExclamationCircle
            size={50}
            color="red"
            style={{ display: "block", margin: "auto", marginTop: "40px" }}
          />
          <h3 className="py-4 text-center">
            Are you sure you want to leave this team?
          </h3>

          <div
            className="w-full text-white bg-[#14AC91] rounded-none hover:bg-[#14AC91] py-2 flex justify-center cursor-pointer"
            onClick={closeModal}
          >
            Go Back
          </div>
          <button
            className="w-full text-white bg-[#C83A3A] rounded-none hover:bg-[#C83A3A] py-2 flex justify-center cursor-pointer"
            onClick={handleLeaveTeam}
            disabled={isLeaving} // Disable button while leaving
          >
            {isLeaving ? (
              <div className="flex justify-center">
                <span className="loading loading-dots loading-xs"></span>
              </div>
            ) : (
              "Leave Team"
            )}
          </button>
        </div>
      </dialog>
    </>
  );
};

export default LeaveTeamDialog;
