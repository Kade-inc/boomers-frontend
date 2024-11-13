import { useState } from "react";
import lebron from "../assets/Mask group.svg";
import UserDetailsCard from "./UserDetailsCard";

interface MemberRequestDialogProps {
  mode: "request" | "member";
}

const MemberRequestDialog = ({ mode }: MemberRequestDialogProps) => {
  const [removeMember, setRemoveMember] = useState(false);
  const [acceptClicked, setAcceptClicked] = useState(false);

  // Toggle view when a team member is clicked
  const handleMemberClick = () => {
    setRemoveMember((prev) => !prev);
  };

  // Handle Accept Button Click
  const handleAcceptClick = () => {
    setAcceptClicked(true);
  };

  return (
    <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle">
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
              {mode === "member" && !removeMember ? (
                <button
                  className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700"
                  type="button"
                  onClick={handleMemberClick}
                >
                  Remove Team Member
                </button>
              ) : (
                <>
                  <button
                    className="btn w-full text-white bg-green-600 rounded-none hover:bg-green-700"
                    onClick={handleAcceptClick}
                  >
                    Accept
                  </button>
                  <button className="btn w-full text-white bg-red-600 rounded-none hover:bg-red-700 !m-0">
                    Reject
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className=" p-4 text-center">
            <p className="text-[16px] text-black mb-4">
              Paul Vitalis has been removed from the team
            </p>
            <button className="btn w-[150px] text-white bg-red-600 rounded-none hover:bg-red-700">
              Close
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default MemberRequestDialog;
