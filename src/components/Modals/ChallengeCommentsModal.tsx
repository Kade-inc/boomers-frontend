import { ArrowLeftIcon } from "@heroicons/react/24/solid";
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
        className="flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 z-50"
      >
        <div className="bg-white h-screen w-full">
          <ArrowLeftIcon onClick={onClose} height={20} width={20} />
          <p>PAUL</p>
        </div>
      </Modal>
    </>
  );
};

export default ChallengeCommentsModal;
