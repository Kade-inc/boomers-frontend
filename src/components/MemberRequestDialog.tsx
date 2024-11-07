import lebron from "../assets/Mask group.svg";
import UserDetailsCard from "./UserDetailsCard";

const MemberRequestDialog = () => {
  return (
    <>
      <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box p-0" style={{ borderRadius: "0px" }}>
          <div className="text-center flex flex-col items-center justify-center bg-yellow">
            <img className="mb-3 mx-auto mt-5" src={lebron} alt="img" />
            <h3 className="text-white mb-5">Paul Vitalis</h3>
          </div>
          <div className="mr-3 ml-3">
            <h3>Current Teams</h3>
            <div className="flex gap-1">
              <UserDetailsCard />
              <UserDetailsCard />
            </div>
            <h3 className="py-4 ">Interests</h3>
            <p>Software Engineering . Frontend . ReactJS</p>
          </div>
          <div className="modal-action">
            <form method="dialog" className="w-full">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-full text-white bg-green-600 rounded-none">
                Accept
              </button>
            </form>
          </div>
          <button className="btn w-full text-white bg-red-600 rounded-none">
            Reject
          </button>
        </div>
      </dialog>
    </>
  );
};

export default MemberRequestDialog;
