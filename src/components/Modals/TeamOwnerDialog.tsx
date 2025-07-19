import TeamMember from "../../entities/TeamMember";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { MdOutlineInterests } from "react-icons/md";

interface TeamOwnerDialogProps {
  selectedTeamMember: TeamMember | null;
}

const TeamOwnerDialog = ({ selectedTeamMember }: TeamOwnerDialogProps) => {
  console.log("NOW: ", selectedTeamMember);

  return (
    <dialog id="team_owner_modal" className="modal modal-middle font-body">
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden !rounded-md"
        style={{ borderRadius: "0px" }}
      >
        <div
          className={`text-center flex flex-col items-center justify-center bg-yellow`}
          style={{ opacity: 1 }}
        >
          <form method="dialog" className="ml-[90%] mt-1">
            <button
              className="rounded-full flex self-end mb-2 absolute top-4 right-6 font-bold text-xl text"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#D92D2D"
                className="size-6 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
          <div className="mb-3 mx-auto mt-5 h-[81px] w-[81px] rounded-full flex items-center justify-center">
            {selectedTeamMember?.profile_picture ? (
              <img
                className="h-full w-full rounded-full"
                src={selectedTeamMember.profile_picture}
                alt="Profile"
              />
            ) : (
              <UserCircleIcon className="h-full w-full text-base-content" />
            )}
          </div>

          <h3 className="text-darkgrey mb-5 text-[18px] font-semibold">
            {selectedTeamMember
              ? `${selectedTeamMember.firstName ?? ""} ${selectedTeamMember.lastName ?? ""}`.trim() ||
                selectedTeamMember.firstName ||
                selectedTeamMember.lastName ||
                selectedTeamMember.username
              : ""}
          </h3>
        </div>
        <div className="p-4">
          <div>
            <h3 className="py-2 text-[16px] font-semibold">Interests</h3>
            <div className="flex items-center mb-2 font-regular text-[14px]">
              {selectedTeamMember?.interests && (
                <>
                  {selectedTeamMember.interests?.domain?.length > 0 ||
                  selectedTeamMember.interests?.subdomain?.length > 0 ||
                  selectedTeamMember.interests?.subdomainTopics?.length > 0 ? (
                    <>
                      {selectedTeamMember.interests.domain}{" "}
                      {selectedTeamMember.interests.subdomain}{" "}
                      {selectedTeamMember.interests.subdomainTopics?.map(
                        (topic: string, index: number) => (
                          <React.Fragment key={index}>
                            <div className="bg-black rounded-full w-1 h-1 mx-1"></div>
                            <p>{topic}</p>
                          </React.Fragment>
                        ),
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center mt-2 w-full">
                      <MdOutlineInterests className="w-10 h-10" />
                      <p className="font-medium text-[13px] md:text-base  mt-2 text-base-content font-body">
                        No interests found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default TeamOwnerDialog;
