import { useState } from "react";
import useGetAllUsers from "../hooks/useGetAllUsers";
import useGetUser from "../hooks/useGetUser";
import React from "react";
import useAddTeamMember from "../hooks/useAddTeamMember";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface AddMemberDialogProps {
  teamId: string;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ teamId }) => {
  const [viewClicked, setViewClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: user, isLoading: isUserLoading } = useGetUser(userId);

  // Only fetch users when searchQuery is not empty
  const { data, isLoading, error } = useGetAllUsers(searchQuery || undefined);
  const users = Array.isArray(data) ? data : [];
  const { mutate: addTeamMember } = useAddTeamMember();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddTeammember = () => {
    setIsAdding(true);

    const testPayload = {
      team_id: teamId,
      username: userName,
    };

    addTeamMember(
      { payload: testPayload },
      {
        onSuccess: () => {
          setIsAdding(false);
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
        },
        onError: () => {
          setIsAdding(false); // Ensure the button resets even if there’s an error
        },
      },
    );
  };

  return (
    <dialog
      id="my_modal_3"
      className="modal fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex justify-center items-start overflow-scroll font-body"
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
            <h3 className="font-normal text-lg text-white mb-4 text-center">
              Search for a user to add to your team
            </h3>
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[500px]">
                <input
                  type="text"
                  className="w-full border border-white bg-transparent rounded h-[40px] pl-10 text-white focus:border-white focus:ring-0 focus:outline-none"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {isLoading && searchQuery && (
              <p className="text-white text-center mt-[60px]">
                <span className="loading loading-dots loading-lg"></span>
              </p>
            )}
            {error && searchQuery && (
              <p className="text-white">Error: {error.message}</p>
            )}

            <div className="flex gap-4 flex-wrap justify-center mt-5">
              {!searchQuery ? (
                <p className="text-white">
                  Enter username, first name or last name to find users
                </p>
              ) : users?.length === 0 && !isLoading ? (
                <p className="text-white">No users found</p>
              ) : (
                users
                  ?.filter((user) => user.isVerified)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="card w-[200px] h-[200px] bg-black font-body border-base-200 shadow-md shadow-base-content/10 base-content rounded text-white"
                    >
                      <div className="flex flex-col justify-center items-center">
                        <div className="h-[95px] flex items-center justify-center mt-6 mb-3">
                          {user.profile.profile_picture ? (
                            <img
                              className="h-[81px] w-[81px] rounded-full bg-white"
                              src={user.profile.profile_picture}
                              alt="User avatar"
                            />
                          ) : (
                            <UserCircleIcon className="h-[81px] w-[81px] text-white rounded-full" />
                          )}
                        </div>

                        <p className="mb-3 w-full text-center">
                          {user.profile.firstName && user.profile.lastName
                            ? `${user.profile.firstName} ${user.profile.lastName}`
                            : user.profile.firstName ||
                              user.profile.lastName ||
                              user.username}
                        </p>

                        <button
                          className=" bg-yellow w-[90px] rounded text-[14px] font-medium text-black"
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

                {user.interests && (
                  <div className="flex items-center mb-2 font-regular text-[14px] text-white">
                    Interests: {user?.interests?.domain}{" "}
                    <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                    {user?.interests?.subdomain}{" "}
                    {user?.interests?.domainTopics.map(
                      (topic: string, index: number) => (
                        <React.Fragment key={index}>
                          <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                          <p>{topic}</p>
                        </React.Fragment>
                      ),
                    )}
                  </div>
                )}
                {!user.interests && (
                  <p className="flex items-center mb-2 font-regular text-[14px] text-white">
                    No interests
                  </p>
                )}
                <button
                  className="bg-yellow text-black border-none w-[150px] p-2 rounded-sm flex justify-center items-center"
                  onClick={handleAddTeammember}
                  disabled={isAdding} // Prevent multiple clicks
                >
                  {isAdding ? (
                    <div className="flex justify-center">
                      <span className="loading loading-dots loading-xs"></span>
                    </div>
                  ) : (
                    "Add to team"
                  )}
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
