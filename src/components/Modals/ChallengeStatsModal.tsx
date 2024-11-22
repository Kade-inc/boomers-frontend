import Modal from "react-modal";
import { XCircleIcon } from "@heroicons/react/24/solid";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChallengeStatsModal = ({ isOpen, onClose }: ModalTriggerProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="z-50"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
      >
        <div className="flex justify-end mt-4 mr-8">
          <XCircleIcon
            width={36}
            height={36}
            onClick={onClose}
            color="#D92D2D"
          />
        </div>
        {/* Add functionality for rating a challenge in the backend */}
        {/* <div className="flex items-center justify-center h-screen ">
          <div className="rounded-lg shadow-lg bg-darkgrey font-body h-[50vh] w-[80%] px-4 pt-8 space-y-2">
            <p className="text-white font-normal">
              {challenge?.difficulty === 1 && "Easy"}
              {challenge?.difficulty === 2 && "Medium"}
              {challenge?.difficulty === 3 && "Hard"}
              {challenge?.difficulty === 4 && "Very Hard"}
              {challenge?.difficulty === 5 && "Legendary"}
            </p>
            <div>
              <p className="font-semibold text-white">Team member ratings</p>
              <div className="flex justify-between rating rating-md mt-4 w-3/4">
                <input
                  type="radio"
                  name="rating-10"
                  className="mask mask-star-2 bg-slate-100"
                />
                <input
                  type="radio"
                  name="rating-10"
                  className="mask mask-star-2 bg-slate-100"
                  defaultChecked
                />
                <input
                  type="radio"
                  name="rating-10"
                  className="mask mask-star-2  bg-slate-100"
                />
                <input
                  type="radio"
                  name="rating-10"
                  className="mask mask-star-2  bg-slate-100"
                />
                <input
                  type="radio"
                  name="rating-10"
                  className="mask mask-star-2  bg-slate-100"
                />
              </div>
              {isTeamMember() && (
                <button className="py-2 bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4 font-medium w-full">
                  Rate challenge
                </button>
              )}
            </div>
          </div>
        </div> */}
      </Modal>
    </>
  );
};

export default ChallengeStatsModal;
