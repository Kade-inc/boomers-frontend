import Modal from "react-modal";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

const ActionCenterModal = ({
  isOpen,
  onClose,
  children,
}: ModalTriggerProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="z-50"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
      >
        <div className="flex justify-end mt-4 mr-8">
          <XCircleIcon width={36} height={36} onClick={onClose} color="red" />
        </div>
        <div className="flex flex-col items-center mt-10 gap-6">
          <div className="text-center font-body font-semibold text-base-content bg-yellow w-1/2 p-3 rounded-md">
            Action Center
          </div>
          <div className="flex flex-col justify-center gap-4">{children}</div>
        </div>
      </Modal>
    </>
  );
};

export default ActionCenterModal;
