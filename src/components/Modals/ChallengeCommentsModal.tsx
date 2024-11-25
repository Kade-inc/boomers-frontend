import { ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
import Comment from "../../entities/Comment";
import { PiChatsBold } from "react-icons/pi";
import { formatDistanceToNow } from "date-fns";
import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../../stores/useAuthStore";
import { useState } from "react";
import useDeleteComment from "../../hooks/Challenges/useDeleteComment";
import { Toaster } from "react-hot-toast";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  challengeId: string;
  comment: string;
  handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handlePostComment: () => void;
  postCommentIsPending: boolean;
  isTeamMember: () => boolean;
  isOwner: () => boolean;
};

const ChallengeCommentsModal = ({
  isOpen,
  onClose,
  comments,
  challengeId,
  comment,
  handleCommentChange,
  handlePostComment,
  postCommentIsPending,
  isTeamMember,
  isOwner,
}: ModalTriggerProps) => {
  const { user } = useAuthStore();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (id: string | null) => {
    setActiveTooltip((prev) => (prev === id ? null : id)); // Toggle between opening and closing
  };
  const deleteCommentMutation = useDeleteComment();

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync({ challengeId, commentId });
    setActiveTooltip(null);
  };
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
        className="flex items-center justify-center z-50 font-body"
        overlayClassName="fixed inset-0 z-50"
      >
        <div className="bg-base-100 h-screen w-full px-8 py-4">
          <div className="flex  items-center">
            <ArrowLeftIcon onClick={onClose} height={20} width={20} />
          </div>

          <div className="flex justify-between border-b-[1px] pb-4 mt-4">
            <p className="text-base-content font-semibold text-[18px]">
              Comments{" "}
              {comments && comments.length > 0 && (
                <span className="ml-2 bg-gray-200 text-darkgrey p-2 rounded-full text-sm font-semibold px-3">
                  {comments.length}
                </span>
              )}
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
              <div
                className={`py-2 overflow-scroll ${isOwner() || isTeamMember() ? "h-[70vh]" : "h-[90vh]"}`}
              >
                {comments.map((comment) => (
                  <div className="py-2" key={comment._id}>
                    <div className="py-2">
                      <div className="flex items-center p-0 relative">
                        {comment.user.profile?.profile_picture ? (
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
                          {comment.user.profile?.firstName &&
                          comment.user.profile?.lastName
                            ? comment.user.profile.firstName +
                              " " +
                              comment.user.profile.lastName
                            : comment.user.username}
                        </p>
                        {comment.user._id === user.user_id && (
                          <div className="ml-auto">
                            <EllipsisHorizontalIcon
                              height={20}
                              width={20}
                              className="cursor-pointer hover:bg-[#EDD38B] hover:rounded-full"
                              onClick={() => toggleTooltip(comment._id)}
                            />
                            {activeTooltip === comment._id && (
                              <div className="absolute right-0 top-full mt-2 w-40 bg-base-100 shadow-md rounded-md">
                                <ul className="py-0 text-sm text-gray-700">
                                  <li
                                    className="px-4 py-2 cursor-pointer flex flex-row items-center space-x-0 hover:bg-gray-200"
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
                                    }
                                  >
                                    <TrashIcon
                                      height={22}
                                      width={22}
                                      color="red"
                                      className="hover:bg-transparent"
                                    />
                                    <button
                                      className="text-error font-medium hover:bg-transparent bg-transparent pl-8"
                                      disabled={deleteCommentMutation.isPending}
                                    >
                                      {deleteCommentMutation.isPending ? (
                                        <span>Deleting...</span>
                                      ) : (
                                        <span>Delete</span>
                                      )}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
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
          {isTeamMember() ||
            (isOwner() && (
              <label className="form-control absolute w-[85%] bottom-2 ">
                <div className="relative flex flex-col bg-base-200 rounded-md">
                  <textarea
                    className="textarea h-24 text-[13px] focus:border-none focus:outline-none w-full mb-2 bg-base-200"
                    placeholder="Add comment..."
                    value={comment}
                    onChange={handleCommentChange}
                  ></textarea>
                  <div className="flex justify-end border-t-2 w-[90%] mx-auto">
                    <button
                      className="btn btn-sm bg-yellow text-darkgrey rounded-md text-[13px] font-medium mt-2 mb-2"
                      type="submit"
                      onClick={handlePostComment}
                      disabled={postCommentIsPending}
                    >
                      {postCommentIsPending ? "Posting..." : "Send"}
                    </button>
                  </div>
                </div>
              </label>
            ))}
        </div>
      </Modal>
    </>
  );
};

export default ChallengeCommentsModal;
