import { useState } from "react";
import userImg from "../assets/user-image.svg";
import useGetAllUsers from "../hooks/useGetAllUsers";
import useGetUser from "../hooks/useGetUser";
import React from "react";
import useAddTeamMember from "../hooks/useAddTeamMember";

interface AddMemberDialogProps {
  teamId: string;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ teamId }) => {
  const [viewClicked, setViewClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const { data: user, isLoading: isUserLoading } = useGetUser(userId);

  // Only fetch users when searchQuery is not empty
  const { data, isLoading, error } = useGetAllUsers(searchQuery || undefined);
  const users = Array.isArray(data) ? data : [];
  const { mutate: addTeamMember } = useAddTeamMember();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddTeammember = () => {
    const testPayload = {
      team_id: teamId,
      username: userName,
    };

    addTeamMember({ payload: testPayload });
  };

  return (
    <dialog
      id="my_modal_3"
      className="modal fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex justify-center items-start overflow-scroll"
    >
      <div className="mt-[90px] text-left w-full max-w-[80%] mx-auto px-4">
        <form method="dialog" onClick={() => setViewClicked(false)}>
          <button
            className="btn btn-sm btn-circle absolute border-none right-2 top-2 bg-red-600 text-white mr-4 mt-4"
            onClick={() => {
              setViewClicked(false);
              setSearchQuery("");
              setUserId("");
              setUserName("");
            }}
          >
            ✕
          </button>
        </form>

        {!viewClicked ? (
          <>
            <h3 className="font-bold text-lg text-white mb-4 text-center">
              Search for a user to add to your team
            </h3>
            <div className="w-full flex justify-center">
              <label className="input input-bordered rounded-none w-full max-w-[500px] border-white bg-transparent flex items-center gap-2 h-[40px] text-white mb-7">
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
                  onChange={handleInputChange}
                />
              </label>
            </div>

            {isLoading && searchQuery && (
              <p className="text-white">Loading...</p>
            )}
            {error && searchQuery && (
              <p className="text-white">Error: {error.message}</p>
            )}

            <div className="flex gap-4 flex-wrap justify-center">
              {!searchQuery ? (
                <p className="text-white">Enter a search term to find users</p>
              ) : users?.length === 0 ? (
                <p className="text-white">No users found</p>
              ) : (
                users
                  ?.filter((user) => user.isVerified)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="card w-[250px] h-[250px] bg-black font-body shadow-lg"
                    >
                      <div className="card-body flex flex-col justify-center items-center">
                        <img
                          className="h-[81px] w-[81px] rounded-full bg-white"
                          src={user.profile_picture || userImg}
                          alt="User avatar"
                        />
                        <p className="text-white">{user.username}</p>
                        <button
                          className="btn bg-yellow border-none w-[90px]"
                          onClick={() => {
                            setViewClicked(true);
                            if (user._id) {
                              setUserId(user._id);
                              setUserName(user?.username || "");
                            }
                          }}
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
              className="text-white text-lg font-bold mb-4 cursor-pointer"
              onClick={() => setViewClicked(false)}
            >
              &lt; Back to results
            </a>
            {isUserLoading ? (
              <p className="text-white">Loading user details...</p>
            ) : user ? (
              <>
                <p className="text-white mb-6">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || "Username not available"}
                </p>

                <div className="flex items-center mb-2 font-regular text-[14px] text-white">
                  {user?.interests?.domain} {user?.interests?.subdomain}{" "}
                  {user?.interests?.domainTopics.map(
                    (topic: string, index: number) => (
                      <React.Fragment key={index}>
                        <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                        <p>{topic}</p>
                      </React.Fragment>
                    ),
                  )}
                </div>

                <button
                  className="btn bg-yellow text-black border-none w-[150px]"
                  onClick={() => {
                    handleAddTeammember();
                    setViewClicked(false);
                    setSearchQuery("");
                    setUserId("");
                    setUserName("");
                    const modal = document.getElementById(
                      "my_modal_3",
                    ) as HTMLDialogElement | null;
                    if (modal) {
                      modal.close();
                    }
                  }}
                >
                  Add to team
                </button>
              </>
            ) : (
              <p className="text-white">User details not available</p>
            )}
          </>
        )}
      </div>
    </dialog>
  );
};

export default AddMemberDialog;
