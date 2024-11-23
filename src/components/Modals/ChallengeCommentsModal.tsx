import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChallengeCommentsModal = ({ isOpen, onClose }: ModalTriggerProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="flex items-center justify-center z-50 font-body"
        overlayClassName="fixed inset-0 z-50"
      >
        <div className="bg-base-100 h-screen w-full px-8 py-4">
          <div className="flex  items-center">
            <ArrowLeftIcon onClick={onClose} height={20} width={20} />
          </div>

          <div className="flex justify-between border-b-[1px] pb-4 mt-4">
            <p className="text-base-content font-semibold text-[18px]">
              Comments
            </p>
          </div>
          <div className="py-2 h-[70vh] overflow-scroll">
            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>

            <div className="py-2">
              <div className="flex items-center p-0">
                <UserCircleIcon
                  height={42}
                  width={42}
                  className="text-base-content"
                />
                <p className="font-semibold ml-4 text-[13px]">Cynthia</p>
              </div>
              <div className="flex justify-between mt-2 border-b-2 pb-4">
                <p className="ml-2 w-[240px] font-medium text-[13px]">
                  This challenge was really cool! I will test multiline
                  comments. They are long comments but I dont know how Ill take
                  it.
                </p>
                <p className="text-[10px] content-end font-semibold">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
          <label className="form-control absolute w-[85%] bottom-2">
            <div className="relative">
              <textarea
                className="textarea h-24 text-[13px] focus:border-none w-full pr-24 focus:outline-none bg-base-200 shadow-lg"
                placeholder="Add comment..."
              ></textarea>
              <button
                className="absolute bottom-2 right-2 btn btn-sm bg-yellow text-darkgrey rounded-sm text-[13px] font-medium "
                type="submit"
              >
                Send
              </button>
            </div>
          </label>
        </div>
      </Modal>
    </>
  );
};

export default ChallengeCommentsModal;
