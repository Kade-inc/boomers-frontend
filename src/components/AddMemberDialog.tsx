import elipse from "../assets/Ellipse 103.svg";

const AddMemberDialog = () => {
  return (
    <dialog
      id="my_modal_3"
      className="modal fixed inset-0 bg-black bg-opacity-80 flex justify-center items-start"
    >
      <div className="mt-[90px] text-left">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle absolute border-none right-2 top-2 bg-red-600 text-white mr-4 mt-4">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-white mb-4">
          Search for a user to add to your team
        </h3>
        <label className="input input-bordered rounded-none w-[500px] border-white bg-transparent flex items-center gap-2 h-[29px] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 flex-shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input type="text" className="w-full" />
        </label>
        <div className="card w-[250px] h-[250px] bg-black font-body shadow-lg mt-8">
          <div className="card-body flex flex-col justify-center items-center">
            <img
              className="h-[81px] w-[81px] rounded-full"
              src={elipse}
              alt="image"
            />
            <p className="text-white">Paul Otieno</p>
            <button className="btn bg-yellow border-none w-[90px]">VIEW</button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AddMemberDialog;
