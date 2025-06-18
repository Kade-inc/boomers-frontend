import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Modal from "react-modal";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChatSearchModal = ({ isOpen, onClose }: ModalTriggerProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg py-10 px-2 md:px-8 w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%]"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30 flex items-center justify-center"
      >
        <div>
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute inset-y-0 left-0 flex items-center pl-2 w-8 h-8 top-2.5 " />
            <input
              type="text"
              placeholder="Search"
              className="input w-full rounded-full pl-10 text-[12px] md:text-base font-body bg-grey input-bordered"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatSearchModal;
