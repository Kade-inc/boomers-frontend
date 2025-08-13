import Modal from "react-modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ExpandedChallengeSolution } from "../../entities/ExpandedChallengeSolution";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  solution: ExpandedChallengeSolution;
};

const ChallengeDescriptionModal = ({
  isOpen,
  onClose,
  solution,
}: ModalTriggerProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg py-10 px-2 md:px-8 w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%]"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30 flex items-center justify-center"
      >
        <div className="absolute top-2 right-3 flex justify-end w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D92D2D"
            className="size-8 cursor-pointer"
            onClick={onClose}
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="font-body flex flex-col items-center">
          <div className="h-[70vh] overflow-scroll text-darkgrey">
            <CKEditor
              editor={ClassicEditor}
              data={solution?.challenge?.description || ""}
              disabled={true}
              config={{
                toolbar: [],
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChallengeDescriptionModal;
