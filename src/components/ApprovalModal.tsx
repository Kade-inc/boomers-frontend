import { UserCircleIcon } from "@heroicons/react/24/solid";
import JoinRequest from "../entities/JoinRequest";
import React from "react";
import useGetUser from "../hooks/useGetUser";
interface ApprovalDialogProps {
  selectedPendingMemberApproval: JoinRequest | null;
}

const ApprovalModal = ({
  selectedPendingMemberApproval,
}: ApprovalDialogProps) => {
  // Pending action
  const id = selectedPendingMemberApproval?.user_id._id ?? "";
  console.log(id);

  // Pending approval
  const userId = selectedPendingMemberApproval?.owner_id._id ?? "";
  console.log(userId);

  const { data: user } = useGetUser(id);
  console.log(user);
  return (
    <dialog id="my_modal_17" className="modal modal-middle font-body">
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden !rounded-md"
        style={{ borderRadius: "0px" }}
      >
        <div className="text-center flex flex-col items-center justify-center bg-yellow ">
          <form method="dialog" className="ml-[90%] mt-1">
            <button className="text-darkgrey font-semibold">X</button>
          </form>
          <div className="mb-3 mx-auto mt-5 h-[81px] w-[81px] rounded-full flex items-center justify-center">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="user_img"
                className="h-full w-full rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-full w-full text-base-content" />
            )}
          </div>
          <h3 className="text-darkgrey mb-5 text-[18px] font-semibold">
            {user?.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName ||
                user?.lastName ||
                user?.username ||
                "Unknown User"}
          </h3>
        </div>

        <div className="p-4">
          <h3 className="py-2 text-[16px] font-semibold">Interests</h3>
          <div className="flex items-center mb-2 font-regular text-[14px] flex-wrap">
            {user?.interests ? (
              (() => {
                const { domain, subdomain, domainTopics } = user.interests;

                const items: string[] = [
                  ...(Array.isArray(domain) ? domain : [domain]).filter(
                    Boolean,
                  ),
                  ...(Array.isArray(subdomain)
                    ? subdomain
                    : [subdomain]
                  ).filter(Boolean),
                  ...(domainTopics ?? []),
                ];

                return items.length > 0 ? (
                  items.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <div className="bg-gray-950 dark:bg-gray-300 rounded-full w-1 h-1 mx-1"></div>
                      )}
                      <p>{item}</p>
                    </React.Fragment>
                  ))
                ) : (
                  <p>No interests found.</p>
                );
              })()
            ) : (
              <p>No interests found.</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="w-full text-white bg-[#14AC91] py-4 rounded-none hover:bg-[#14AC91] text-center cursor-pointer">
            Chat
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ApprovalModal;
