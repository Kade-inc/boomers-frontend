import { UserCircleIcon } from "@heroicons/react/24/solid";
import JoinRequest from "../entities/JoinRequest";
import React from "react";
interface ActionDialogProps {
  selectedPendingMemberAction: JoinRequest | null;
}

const ApprovalModal = ({ selectedPendingMemberAction }: ActionDialogProps) => {
  return (
    <dialog id="my_modal_99" className="modal modal-middle font-body">
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden !rounded-md"
        style={{ borderRadius: "0px" }}
      >
        <div className="text-center flex flex-col items-center justify-center bg-yellow ">
          <form method="dialog" className="ml-[90%] mt-1">
            <button className="text-darkgrey font-semibold">X</button>
          </form>
          <div className="mb-3 mx-auto mt-5 h-[81px] w-[81px] rounded-full flex items-center justify-center">
            {selectedPendingMemberAction?.user_id.profile_picture ? (
              <img
                src={selectedPendingMemberAction.user_id.profile_picture}
                alt="user_img"
                className="h-full w-full rounded-full"
              />
            ) : (
              <UserCircleIcon className="h-full w-full text-base-content" />
            )}
          </div>
          <h3 className="text-darkgrey mb-5 text-[18px] font-semibold">
            {selectedPendingMemberAction?.user_id.profile.firstName &&
            selectedPendingMemberAction?.user_id.profile.lastName
              ? `${selectedPendingMemberAction.user_id.profile.firstName} ${selectedPendingMemberAction.user_id.profile.lastName}`
              : selectedPendingMemberAction?.user_id.profile.firstName ||
                selectedPendingMemberAction?.user_id.profile.lastName ||
                selectedPendingMemberAction?.user_id.profile.username ||
                "Unknown User"}
          </h3>
        </div>

        <div className="p-4">
          <h3 className="py-2 text-[16px] font-semibold">Interests</h3>

          <div className="flex items-center mb-2 font-regular text-[14px]">
            {selectedPendingMemberAction?.user_id?.interests ? (
              selectedPendingMemberAction?.user_id?.interests.domain ||
              selectedPendingMemberAction?.user_id?.interests.subdomain ||
              selectedPendingMemberAction?.user_id?.interests.domainTopics
                ?.length > 0 ? (
                <>
                  <p>
                    {selectedPendingMemberAction?.user_id?.interests.domain}
                  </p>
                  <p>
                    {selectedPendingMemberAction?.user_id?.interests.subdomain}
                  </p>

                  {selectedPendingMemberAction?.user_id?.interests.domainTopics?.map(
                    (topic: string, index: number) => (
                      <React.Fragment key={index}>
                        <div className="bg-black rounded-full w-1 h-1 mx-1"></div>
                        <p>{topic}</p>
                      </React.Fragment>
                    ),
                  )}
                </>
              ) : (
                <p>No interests found.</p>
              )
            ) : (
              <p>No interests found.</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="w-full text-white bg-[#14AC91] py-4 rounded-none hover:bg-[#14AC91] text-center cursor-pointer">
            Accept
          </div>
          <div className="w-full text-white bg-[#C83A3A] py-4 rounded-none hover:bg-[#C83A3A] text-center cursor-pointer">
            Reject
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ApprovalModal;
