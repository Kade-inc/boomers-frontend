import { useEffect, useState } from "react";
import elipse from "../assets/Ellipse 103.svg";
import useGetAllUsers from "../hooks/useGetAllUsers";

const AddMemberDialog = () => {
  const [viewClicked, setViewClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users with the username query
  const { data, isLoading, error } = useGetAllUsers(searchQuery);
  const users = Array.isArray(data) ? data : [];
  console.log(users);

  // Update searchQuery based on input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setViewClicked(false);
  }, [searchQuery]);

  return (
    <dialog
      id="my_modal_3"
      className="modal fixed inset-0 bg-black bg-opacity-80 flex justify-center items-start"
    >
      <div className="mt-[90px] text-left">
        <form method="dialog" onClick={() => setViewClicked(false)}>
          <button className="btn btn-sm btn-circle absolute border-none right-2 top-2 bg-red-600 text-white mr-4 mt-4">
            ✕
          </button>
        </form>

        {!viewClicked ? (
          <>
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
              <input
                type="text"
                className="w-full"
                value={searchQuery}
                onChange={handleInputChange} // Update search query
              />
            </label>

            {/* Spinner */}
            {isLoading && <p className="text-white">Loading...</p>}
            {error && <p className="text-white">Error: {error.message}</p>}

            {/* Show filtered users*/}
            <div className="mt-4">
              {users?.length === 0 ? (
                <p className="text-white">No users found</p>
              ) : (
                users?.map((user) => (
                  <div
                    key={user._id}
                    className="card w-[250px] h-[250px] bg-black font-body shadow-lg mt-8"
                  >
                    <div className="card-body flex flex-col justify-center items-center">
                      <img
                        className="h-[81px] w-[81px] rounded-full"
                        src={elipse}
                        alt="image"
                      />
                      <p className="text-white">{user.username}</p>
                      <button
                        className="btn bg-yellow border-none w-[90px]"
                        onClick={() => setViewClicked(true)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <a
              className="text-white text-lg font-bold mb-4"
              onClick={() => setViewClicked(false)}
            >
              &lt; Back to results
            </a>
            <p className="text-white mb-6">Paul Otieno</p>
            <p className="text-white mb-6">
              Interests: <span>Software Development, Javascript</span>
            </p>
            <button className="btn bg-yellow text-black border-none w-[150px]">
              Add to team
            </button>
          </>
        )}
      </div>
    </dialog>
  );
};

export default AddMemberDialog;
