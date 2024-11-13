import { AiOutlineExclamationCircle } from "react-icons/ai";
const LeaveTeamDialog = () => {
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
              <button className="btn w-full text-white bg-green-600"></button>
            </form>
          </div>
          <button className="btn w-full text-white bg-red-600">
            Leave Team
          </button>
        </div>
      </dialog>
    </>
  );
};

export default LeaveTeamDialog;
