import Modal from "react-modal";
import Team from "../entities/Team";
import useTeam from "../hooks/useTeam";
import { Toaster } from "react-hot-toast";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  modalData: Team;
};

interface Member {
  email: string;
  firstName?: string;
  lastName?: string;
  profile: string;
  profile_picture: string | null;
  username: string;
  _id: string;
}

const RecommendationsModal = ({
  isOpen,
  onClose,
  modalData,
}: ModalTriggerProps) => {
  const { data: team } = useTeam(modalData?._id || "");

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: "#D92D2D",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#D92D2D",
            },
          },
        }}
      />
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        appElement={document.getElementById("root") || undefined} // Ensure app element is set for accessibility
        className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000033]"
        overlayClassName="overlay" // Optional: custom overlay styling if needed
      >
        <div className=" rounded-lg shadow-lg w-[90%] md:max-w-4xl mx-auto h-[80vh] top-[5vh] overflow-y-auto relative mb-14 px-4 md:px-[100px] py-20 bg-base-100 text-base-content">
          <div className="flex justify-end w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#D92D2D"
              className="size-6 cursor-pointer"
              onClick={onClose}
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {team && (
            <>
              <h1 className="font-body font-bold text-[30px] mb-5">
                {team.name}
              </h1>
              <div className="relative">
                <div className="absolute bottom-0 top-8 left-4 transform -translate-x-1/2 w-6 h-[6px] bg-base-content rounded "></div>
                <p className="font-body font-semibold text-[20px] ">Owner</p>
              </div>
              <div className="mt-6 flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-10"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-5">{team.members[0].username}</p>
              </div>

              <div className="relative mt-5">
                <div className="absolute bottom-0 top-8 left-4 transform -translate-x-1/2 w-6 h-[6px] bg-base-content rounded "></div>
                <p className="font-body font-semibold text-[20px] ">
                  House Mates
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-12">
                {team.members.map((member: Member) => (
                  <div className="flex flex-row items-center" key={member._id}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-10"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-5">{member.username}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex justify-end h-[30vh] items-end">
            <button className="btn bg-yellow text-darkgrey border-none text-[17px] font-body">
              Request to join
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RecommendationsModal;
