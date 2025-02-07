import { AiOutlineExclamationCircle } from "react-icons/ai";
import useLeaveTeam from "../hooks/useLeaveTeam";
import toast from "react-hot-toast";

interface LeaveTeamDialogProps {
  teamId: string;
}

const LeaveTeamDialog = ({ teamId }: LeaveTeamDialogProps) => {
  const leaveTeam = useLeaveTeam();

  const handleLeaveTeam = () => {
    leaveTeam.mutate(teamId, {
      onSuccess: () => {
        toast.success("Successfully left the team!");
      },
      onError: (error: Error) => {
        toast.error(`Failed to leave the team: ${error.message}`);
      },
    });
  };

  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box pt-10 pr-0 pl-0">
          <AiOutlineExclamationCircle
            size={50}
            color="red"
            style={{ display: "block", margin: "auto" }}
          />
          <h3 className="py-4 text-center">
            Are you sure you want to leave this team?
          </h3>
          <div className="modal-action">
            <form method="dialog" className="w-full">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-full text-white bg-green-600 rounded-none">
                Go Back
              </button>
              <button
                className="btn w-full text-white bg-red-600 rounded-none"
                onClick={handleLeaveTeam}
              >
                Leave Team
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default LeaveTeamDialog;
