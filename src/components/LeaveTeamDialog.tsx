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

          <div className=" w-full text-white bg-[#14AC91] rounded-none hover:bg-[#14AC91] py-2 flex justify-center cursor-pointer">
            Go Back
          </div>
          <div
            className=" w-full text-white bg-[#C83A3A] rounded-none hover:bg-[#C83A3A] py-2 flex justify-center cursor-pointer"
            onClick={handleLeaveTeam}
          >
            Leave Team
          </div>
        </div>
      </dialog>
    </>
  );
};

export default LeaveTeamDialog;
