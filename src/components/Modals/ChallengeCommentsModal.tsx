import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
import Comment from "../../entities/Comment";
import { PiChatsBold } from "react-icons/pi";
import { formatDistanceToNow } from "date-fns";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
};

const ChallengeCommentsModal = ({
  isOpen,
  onClose,
  comments,
}: ModalTriggerProps) => {
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
          {comments.length === 0 && (
            <>
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <PiChatsBold size={50} />
                <p>No comments</p>
              </div>
            </>
          )}

          {comments.length > 0 && (
            <>
              <div className="py-2 h-[70vh] overflow-scroll">
                {comments.map((comment) => (
                  <div className="py-2" key={comment._id}>
                    <div className="py-2">
                      <div className="flex items-center p-0">
                        {comment.user.profile.profile_picture ? (
                          <img
                            src={comment.user.profile.profile_picture}
                            alt="profile Picture"
                            className=" object-cover rounded-full w-10 h-10 overflow-hidden "
                          />
                        ) : (
                          <UserCircleIcon
                            height={42}
                            width={42}
                            className="text-base-content"
                          />
                        )}
                        <p className="font-semibold ml-4 text-[13px]">
                          {comment.user.profile.firstName &&
                          comment.user.profile.lastName
                            ? comment.user.profile.firstName +
                              " " +
                              comment.user.profile.lastName
                            : comment.user.username}
                        </p>
                      </div>
                      <div className="flex justify-between mt-2 border-b-2 pb-4">
                        <p className="ml-2 w-[240px] font-medium text-[13px]">
                          {comment.comment}
                        </p>
                        <p className="text-[10px] content-end font-semibold">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
