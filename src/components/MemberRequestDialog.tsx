import { useState, useRef } from "react";
import lebron from "../assets/Mask group.svg";
import UserDetailsCard from "./UserDetailsCard";

interface MemberRequestDialogProps {
  mode: "request" | "member";
}

const MemberRequestDialog = ({ mode }: MemberRequestDialogProps) => {
  const [selectedMember, setSelectedMember] = useState(false);
  const [acceptClicked, setAcceptClicked] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Reset state when the dialog is closed
  const handleDialogClose = () => {
    setAcceptClicked(false);
    setSelectedMember(false);
  };

  return (
    <dialog
      ref={dialogRef}
      id="my_modal_7"
      className="modal modal-bottom sm:modal-middle"
      onClose={handleDialogClose}
    >
      <div className="modal-box p-0" style={{ borderRadius: "0px" }}>
        <div className="text-center flex flex-col items-center justify-center bg-yellow">
          <img className="mb-3 mx-auto mt-5" src={lebron} alt="img" />
          <h3 className="text-white mb-5 text-[18px] font-bold">John Doe</h3>
        </div>

        {!acceptClicked ? (
          <>
            <div className="p-4">
              <h3 className="text-[16px] font-bold mb-2">Current Teams</h3>
              <div className="flex gap-2 mb-4">
                <UserDetailsCard />
                <UserDetailsCard />
              </div>
              <h3 className="py-2 text-[16px] font-bold">Interests</h3>
              <p className="text-[14px] font-medium">
                Software Engineering • Frontend • ReactJS
              </p>
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-action flex flex-col">
              {mode === "member" && !selectedMember ? (
                <button
                  className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700"
                  type="button"
                  onClick={() => setSelectedMember(true)}
                >
                  Remove Team Member
                </button>
              ) : (
                <>
                  {mode === "request" && (
                    <div className="flex w-full flex-col">
                      <button className="btn w-full text-white bg-green-600 rounded-none hover:bg-green-700">
                        Accept
                      </button>
                      <form method="dialog">
                        <button className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700">
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                  {mode === "member" && selectedMember && (
                    <div className="flex w-full">
                      <form method="dialog" className="w-1/2 !m-0">
                        <button className="btn w-full text-white bg-green-600 rounded-none hover:bg-green-700">
                          Cancel
                        </button>
                      </form>
                      <button
                        className="btn w-1/2 text-white bg-red-600 rounded-none hover:bg-red-700 !m-0"
                        onClick={() => setAcceptClicked(true)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-[16px] text-black mb-4">
              {mode === "member"
                ? "Paul Vitalis has been removed from the team"
                : "Request has been processed"}
            </p>
            <form method="dialog">
              <button className="btn w-[150px] text-white bg-red-600 rounded-none hover:bg-red-700">
                Close
              </button>
            </form>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default MemberRequestDialog;
