import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useGetSolution from "../hooks/ChallengeSolution/useGetSolution";
import useAddSolutionStep from "../hooks/ChallengeSolution/useAddSolutionStep";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import useUpdateSolutionStep from "../hooks/ChallengeSolution/useUpdateSolutionStep";
import { TbEdit } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import useDeleteSolutionStep from "../hooks/ChallengeSolution/useDeleteSolutionStep";
import useUpdateSolution from "../hooks/ChallengeSolution/useUpdateSolution";
import { toast, Toaster } from "react-hot-toast";
import { PiChatsBold, PiConfettiDuotone } from "react-icons/pi";
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useGetSolutionStepComments } from "../hooks/ChallengeSolution/useGetSolutionStepComments";
import useAuthStore from "../stores/useAuthStore";
import { useDeleteSolutionStepComment } from "../hooks/ChallengeSolution/useDeleteSolutionStepComment";
import { formatDistanceToNow } from "date-fns";
import { useAddSolutionStepComment } from "../hooks/ChallengeSolution/useAddSolutionStepComment";
import { useGetSolutionComments } from "../hooks/ChallengeSolution/useGetSolutionComments";
import { useAddSolutionComment } from "../hooks/ChallengeSolution/useAddSolutionComment";
import { useDeleteSolutionComment } from "../hooks/ChallengeSolution/useDeleteSolutionComment";
import ChallengeDescriptionModal from "../components/Modals/ChallengeDescriptionModal";
import SubmitSolutionModal from "../components/Modals/SubmitSolutionModal";
import DeleteSolutionModal from "../components/Modals/DeleteSolutionModal";
import { TiDeleteOutline } from "react-icons/ti";
import { AxiosError } from "axios";
import useGetAllSolutionRatings from "../hooks/ChallengeSolution/useGetAllSolutionRatings";
import usePostSolutionRating from "../hooks/ChallengeSolution/usePostSolutionRating";
import useUpdateSolutionRating from "../hooks/ChallengeSolution/useUpdateSolutionRating";
import useShareUrl from "../hooks/useShareUrl";

const ChallengeSolutionPage = () => {
  const navigate = useNavigate();
  const { challengeId, solutionId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [stepId, setStepId] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const {
    data: solution,
    isLoading: solutionIsLoading,
    error: solutionError,
    refetch: refetchSolution,
  } = useGetSolution(challengeId!, solutionId!);

  console.log("SOL: ", solution);

  useEffect(() => {
    if (
      solutionError instanceof AxiosError &&
      solutionError.response?.status === 404
    ) {
      navigate(`/challenge/${challengeId}`);
    }
  }, [solutionError, challengeId, navigate]);

  const {
    data: stepComments,
    isLoading: stepCommentsPending,
    refetch: refetchStepComments,
    error: stepCommentsError,
  } = useGetSolutionStepComments({
    challengeId: challengeId!,
    stepId: stepId!,
    solutionId: solutionId!,
  });
  const { mutate: addStep, isPending: isAddingStep } = useAddSolutionStep();
  const { mutate: updateStep, isPending: isUpdatingStep } =
    useUpdateSolutionStep();
  const { mutate: deleteStep, isPending: isDeletingStep } =
    useDeleteSolutionStep();
  const { mutate: updateSolution, isPending: isUpdatingSolution } =
    useUpdateSolution();

  const { mutate: deleteStepComment, isPending: isDeletingStepComment } =
    useDeleteSolutionStepComment();
  const { mutate: addStepComment, isPending: isAddingStepComment } =
    useAddSolutionStepComment();
  const {
    data: solutionComments,
    isLoading: solutionCommentsPending,
    refetch: refetchSolutionComments,
    error: solutionCommentsError,
  } = useGetSolutionComments({
    challengeId: challengeId!,
    solutionId: solutionId!,
  });
  const {
    mutate: deleteSolutionComment,
    isPending: isDeletingSolutionComment,
  } = useDeleteSolutionComment();
  const { mutate: addSolutionComment, isPending: isAddingSolutionComment } =
    useAddSolutionComment();

  console.log(solution);

  // Step management
  const [stepInput, setStepInput] = useState("");
  const [steps, setSteps] = useState<
    { _id: string; description: string; completed: boolean }[]
  >([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [stepComment, setStepComment] = useState("");
  const [descOpen, setDescOpen] = useState(false);
  const [deletingStepIndex, setDeletingStepIndex] = useState<number | null>(
    null,
  );
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null);
  const [solutionComment, setSolutionComment] = useState("");
  const [showChallengeDescriptionModal, setShowChallengeDescriptionModal] =
    useState(false);
  const [isSubmitSolutionModalOpen, setIsSubmitSolutionModalOpen] =
    useState(false);
  const [submittedSolution, setSubmittedSolution] = useState(false);
  const [isDeleteSolutionModalOpen, setIsDeleteSolutionModalOpen] =
    useState(false);
  const [solutionDeleted, setSolutionDeleted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [solutionRatingId, setSolutionRatingId] = useState<string | null>(null);
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [mentorRating, setMentorRating] = useState<number | null>(null);
  const [isRating, setIsRating] = useState<boolean>(false);

  const { data: solutionRatings } = useGetAllSolutionRatings(
    challengeId!,
    solutionId!,
  );
  console.log(solutionRatings);

  const { mutate: postSolutionRating, isPending: isPostingSolutionRating } =
    usePostSolutionRating();

  const { mutate: updateSolutionRating, isPending: isUpdatingSolutionRating } =
    useUpdateSolutionRating();

  // Share URL hook
  const { share: handleShare, isLoading: isShareLoading } = useShareUrl({
    resourceType: "solution",
    resourceId: solutionId || "",
    frontendPath: `/challenge/${challengeId}/solution/${solutionId}`,
  });

  const handleRateSolution = (currentRate: number | null) => {
    if (!currentRate) return;

    if (solutionRatingId) {
      // Update existing rating
      updateSolutionRating(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          ratingId: solutionRatingId,
          rating: currentRate,
        },
        {
          onSuccess: () => {
            toast.success("Solution rating updated successfully");
            setIsRating(false);
            setRating(currentRate);
          },
          onError: (error: Error) => {
            toast.error(error.message);
          },
        },
      );
    } else {
      // Create new rating
      postSolutionRating(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          rating: currentRate,
        },
        {
          onSuccess: () => {
            toast.success("Solution rated successfully");
            setIsRating(false);
            setRating(currentRate);
          },
          onError: (error: Error) => {
            toast.error(error.message);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (solutionRatings) {
      console.log(solutionRatings);
      const rating = solutionRatings.find(
        (rating) => rating.user_id === user.user_id,
      );
      setSolutionRatingId(rating?._id || null);
      setRating(rating?.rating || null);

      const allRatings = solutionRatings.map((rating) => rating.rating);
      const averageRating =
        allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length;
      setOverallRating(averageRating);

      const mentorRating = solutionRatings.filter(
        (rating) => rating.user_id === solution?.challenge.owner_id,
      );
      setMentorRating(mentorRating[0]?.rating || null);
    }
  }, [solutionRatings]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setDescOpen(true);
    }
  }, []);

  useEffect(() => {
    if (solution && Array.isArray(solution.steps)) {
      setSteps(
        solution.steps.map((step) => ({
          _id: step._id,
          description: step.description,
          completed: step.completed || false,
        })),
      );
    }
  }, [solution]);

  const handleAddStep = () => {
    if (stepInput.trim()) {
      addStep(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          description: stepInput.trim(),
        },
        {
          onSuccess: () => {
            setStepInput("");
            refetchSolution();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    }
  };

  const handleDeleteStep = (index: number) => {
    setDeletingStepIndex(index);
    deleteStep(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        stepId: steps[index]._id,
      },
      {
        onSuccess: () => {
          setDeletingStepIndex(null);
          refetchSolution();
          if (editIndex === index) {
            setEditIndex(null);
            setEditValue("");
          }
        },
        onError: (error) => {
          setDeletingStepIndex(null);
          toast.error(error.message);
        },
      },
    );
  };

  const handleDeleteStepComment = (commentId: string) => {
    deleteStepComment(
      {
        challengeId: challengeId!,
        stepId: stepId!,
        solutionId: solutionId!,
        commentId: commentId,
      },
      {
        onSuccess: () => {
          refetchStepComments();
          toast.success("Comment deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
    setActiveTooltip(null);
  };

  const handleDeleteSolutionComment = (commentId: string) => {
    deleteSolutionComment(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        commentId: commentId,
      },
      {
        onSuccess: () => {
          refetchSolutionComments();
          toast.success("Comment deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleAddSolutionComment = () => {
    addSolutionComment(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        comment: solutionComment,
      },
      {
        onSuccess: () => {
          refetchSolutionComments();
          setSolutionComment("");
          toast.success("Comment added successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleEditStep = (index: number) => {
    setEditIndex(index);
    setEditValue(steps[index].description);
  };

  const handleSaveEditStep = () => {
    if (editIndex !== null && editValue.trim() && steps[editIndex]) {
      updateStep(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          stepId: steps[editIndex]._id,
          payload: {
            description: editValue.trim(),
          },
        },
        {
          onSuccess: () => {
            setEditIndex(null);
            setEditValue("");
            refetchSolution();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    }
  };

  const isOwner = () => {
    return user.user_id === solution?.user._id;
  };

  const handleStepCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setStepComment(e.target.value);
  };

  const handleSolutionCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSolutionComment(e.target.value);
  };

  const handlePostStepComment = () => {
    addStepComment(
      {
        challengeId: challengeId!,
        stepId: stepId!,
        solutionId: solutionId!,
        comment: stepComment,
      },
      {
        onSuccess: () => {
          refetchStepComments();
          setStepComment("");
          toast.success("Comment added successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue("");
  };
  const toggleTooltip = (id: string | null) => {
    setActiveTooltip((prev) => (prev === id ? null : id)); // Toggle between opening and closing
  };

  const handleCommitSolution = () => {
    updateSolution(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        payload: {
          status: 1,
        },
      },
      {
        onSuccess: () => {
          refetchSolution();
          toast.success("Solution committed successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleCompleteStep = (stepId: string) => {
    const step = steps.find((s) => s._id === stepId);
    if (!step) return;

    setUpdatingStepId(stepId);
    updateStep(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        stepId: stepId,
        payload: {
          completed: true,
          description: step.description,
        },
      },
      {
        onSuccess: () => {
          setUpdatingStepId(null);
          refetchSolution();
        },
        onError: (error) => {
          setUpdatingStepId(null);
          toast.error(error.message);
        },
      },
    );
  };

  if (solutionIsLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (solutionError) return <div>Error: {solutionError.message}</div>;

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          success: {
            style: {
              background: "#1AC171",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#1AC171",
            },
          },
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
      <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold">
        <div>
          <Link
            to={`/challenge/${challengeId}`}
            className="text-base-content font-body hover:text-primary"
          >
            ← Back <span className="hidden md:inline">to Challenge</span>
          </Link>
        </div>

        <div className="flex items-center justify-center mb-10 gap-4">
          <h1 className="font-heading text-4xl">
            <span>{solution?.challenge.challenge_name}</span>
          </h1>
          <button
            className="btn bg-transparent border-yellow hover:bg-yellow/80 hover:text-darkgrey px-10"
            onClick={handleShare}
            disabled={isShareLoading}
          >
            {isShareLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Share"
            )}
          </button>
        </div>

        {!solutionDeleted && solution?.status === 0 && (
          <>
            <div className="flex md:flex-row flex-col justify-between gap-10">
              <div className="text-darkgrey md:w-[45%]">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-base-content">Description</p>
                  <button
                    className="text-sm text-base-content md:hidden"
                    onClick={() => setDescOpen((open) => !open)}
                  >
                    {descOpen ? (
                      <span className="flex items-center gap-2">
                        Collapse <FaChevronDown />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Expand <FaChevronUp />
                      </span>
                    )}
                  </button>
                </div>
                {descOpen && (
                  <div className="h-[70vh] overflow-scroll">
                    <CKEditor
                      editor={ClassicEditor}
                      data={solution?.challenge.description}
                      disabled={true}
                      config={{
                        toolbar: [],
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="md:w-[45%]">
                <p className="mb-2 font-semibold text-base-content">Steps</p>
                {/* Steps List */}
                {steps.length > 0 && (
                  <div className="flex flex-col gap-4 mb-4">
                    {steps.map((step, idx) => (
                      <div
                        key={step._id}
                        className="flex items-center justify-between bg-base-100 p-4 rounded border border-base-content/10"
                      >
                        {editIndex === idx ? (
                          <div className="flex-1 flex items-center gap-2">
                            <textarea
                              className="border rounded p-1 flex-1 focus:outline-none"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <button
                              className="text-green-600 font-bold"
                              onClick={handleSaveEditStep}
                              title="Save"
                              disabled={isUpdatingStep}
                            >
                              {isUpdatingStep ? (
                                <span className="loading loading-dots loading-xs"></span>
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              className="text-gray-500"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <IoIosClose className="text-3xl text-base-content" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-base-content w-[90%] font-medium">
                              {step.description}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                className="ml-2 text-teal-500"
                                onClick={() => handleEditStep(idx)}
                                title="Edit"
                              >
                                <TbEdit className="text-2xl text-teal-500" />
                              </button>
                              <button
                                className="ml-2 text-red-500"
                                onClick={() => handleDeleteStep(idx)}
                                title="Delete"
                                disabled={
                                  isDeletingStep && deletingStepIndex === idx
                                }
                              >
                                {isDeletingStep && deletingStepIndex === idx ? (
                                  <span className="loading loading-dots loading-xs"></span>
                                ) : (
                                  <FaTrash className="text-lg text-red-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* Step Input */}
                <textarea
                  className="w-full border rounded p-2 mb-2 font-medium bg-transparent focus:outline-none"
                  placeholder={
                    steps.length === 0
                      ? "Type your first step here..."
                      : "Type your next step here..."
                  }
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                />
                <button
                  className="bg-[#00989B] text-white px-8 py-2 rounded font-medium"
                  onClick={handleAddStep}
                  disabled={!stepInput.trim() || isAddingStep}
                >
                  {isAddingStep ? (
                    <span className="loading loading-dots loading-xs"></span>
                  ) : steps.length === 0 ? (
                    "Add"
                  ) : (
                    "Add step"
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
                disabled={isUpdatingSolution || steps.length === 0}
                onClick={handleCommitSolution}
              >
                {isUpdatingSolution ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : (
                  "Commit"
                )}
              </button>
            </div>
          </>
        )}
        {!solutionDeleted && solution?.status === 1 && (
          <div className="flex flex-col items-center justify-center mb-10 relative gap-4">
            <button
              className="border-2 border-teal-500 text-teal-500 px-6 py-2 rounded-full cursor-pointer"
              onClick={() => setShowChallengeDescriptionModal(true)}
            >
              Challenge Description
            </button>
            <ChallengeDescriptionModal
              isOpen={showChallengeDescriptionModal}
              onClose={() => setShowChallengeDescriptionModal(false)}
              solution={solution}
            />
            <h2 className="text-md font-bold">
              {solution.user.profile.firstName && solution.user.profile.lastName
                ? solution.user.profile.firstName +
                  " " +
                  solution.user.profile.lastName
                : solution.user.profile.username}
              &apos;s solution
            </h2>

            <div className="flex gap-2">
              <p className="text-6xl font-bold flex items-end">
                {solution.percentageCompleted}
              </p>
              <p className="flex items-end">% Complete</p>
            </div>
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 gap-4">
              <h1>Steps</h1>
              <div className="flex flex-col items-center justify-center w-full gap-6">
                {solution.steps.map((step, idx) => (
                  <div
                    key={step._id}
                    className="flex items-center justify-between bg-base-100 p-4 rounded border border-base-content/10 w-3/4"
                  >
                    {editIndex === idx ? (
                      <div className="flex-1 flex items-center gap-2">
                        <textarea
                          className="border rounded p-1 flex-1 focus:outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="text-green-600 font-bold"
                          onClick={handleSaveEditStep}
                          title="Save"
                          disabled={isUpdatingStep}
                        >
                          {isUpdatingStep ? (
                            <span className="loading loading-dots loading-xs"></span>
                          ) : (
                            <FaCheck />
                          )}
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          <IoIosClose className="text-3xl text-base-content" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base-content w-[90%] font-medium">
                          {step.description}
                        </span>
                        <div className="flex items-center gap-2">
                          {step.completed ? (
                            <div className="bg-green-500 text-white px-2 py-2 text-sm rounded-full font-medium">
                              <FaCheck />
                            </div>
                          ) : (
                            isOwner() && (
                              <button
                                className="bg-yellow text-darkgrey px-6 py-1 text-sm rounded font-medium"
                                onClick={() => handleCompleteStep(step._id)}
                                title="Edit"
                                disabled={updatingStepId === step._id}
                              >
                                {updatingStepId === step._id ? (
                                  <span className="loading loading-dots loading-xs"></span>
                                ) : (
                                  "Complete"
                                )}
                              </button>
                            )
                          )}
                          {!step.completed && isOwner() && (
                            <button
                              className="ml-2 text-teal-500"
                              onClick={() => handleEditStep(idx)}
                              title="Edit"
                            >
                              <TbEdit className="text-2xl text-teal-500" />
                            </button>
                          )}

                          <button
                            className="ml-2 text-teal-500"
                            onClick={() => {
                              const drawer = document.getElementById(
                                "step-comment-drawer",
                              ) as HTMLInputElement | null;
                              if (drawer) {
                                setStepId(step._id);
                                drawer.checked = true; // Open the drawer
                              }
                            }}
                            title="Comments"
                          >
                            <PiChatsBold size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isOwner() && (
              <div className="flex items-center justify-center gap-4">
                <button
                  className="bg-red-500 text-white px-8 py-2 rounded font-medium"
                  onClick={() => setIsDeleteSolutionModalOpen(true)}
                >
                  Delete Solution
                </button>

                <button
                  className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
                  onClick={() => setIsSubmitSolutionModalOpen(true)}
                >
                  Submit Solution
                </button>
              </div>
            )}
            <DeleteSolutionModal
              isOpen={isDeleteSolutionModalOpen}
              onClose={() => setIsDeleteSolutionModalOpen(false)}
              challengeId={challengeId!}
              solutionId={solutionId!}
              setSolutionDeleted={setSolutionDeleted}
            />
            <button
              className="hidden md:block absolute bg-transparent border-2 border-teal-500 text-teal-500 px-8 py-2 rounded font-medium right-0 top-0"
              onClick={() => {
                const drawer = document.getElementById(
                  "solution-comment-drawer",
                ) as HTMLInputElement | null;
                if (drawer) {
                  drawer.checked = true; // Open the drawer
                }
              }}
            >
              Comments
            </button>
          </div>
        )}
        {!solutionDeleted && solution?.status === 2 && submittedSolution && (
          <div className="flex flex-col items-center justify-center mb-10 relative gap-4 h-[50vh]">
            <p className="text-base-content font-body font-bold text-[18px] lg:text-[25px]">
              Success!
            </p>
            <PiConfettiDuotone className="text-teal-500 text-[100px]" />
            <p className="text-[14px] text-nowrap lg:text-[18px] font-medium font-body text-center py-2 lg:py-2">
              Your solution was submitted successfully!
            </p>
            <button
              className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
              onClick={() => setSubmittedSolution(false)}
            >
              View Solution
            </button>
          </div>
        )}
        {!solutionDeleted && solution?.status === 2 && !submittedSolution && (
          <div className="flex flex-col items-center justify-center mb-10 relative gap-4 pb-10">
            <div className="flex gap-2">
              <p className="text-6xl font-bold flex items-end">
                {solution.percentageCompleted}
              </p>
              <p className="flex items-end">% Complete</p>
            </div>
            <div>
              <p className="text-base-content font-bold text-[18px] text-center mb-4">
                Solution Links
              </p>
              <p className="bg-gradient-to-bl from-[#495D6D] to-[#313752] p-4 text-white rounded-md">
                <a
                  href={solution.demo_url || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {solution.demo_url || "No demo URL"}
                </a>
              </p>
              <p className="bg-gradient-to-bl from-[#495D6D] to-[#313752] p-4 text-white rounded-md mt-4">
                <a
                  href={solution.solution || ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {solution.solution || "No solution URL"}
                </a>
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between w-[90%] gap-4">
              <div className="flex flex-col items-start w-full md:w-1/2 gap-4">
                <h1>Steps</h1>
                <div className="flex flex-col items-start justify-center w-full gap-6">
                  {solution.steps.map((step, idx) => (
                    <div
                      key={step._id}
                      className="flex items-center justify-between bg-base-100 p-4 rounded border border-base-content/10 w-full md:w-3/4"
                    >
                      {editIndex === idx ? (
                        <div className="flex-1 flex items-center gap-2">
                          <textarea
                            className="border rounded p-1 flex-1 focus:outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="text-green-600 font-bold"
                            onClick={handleSaveEditStep}
                            title="Save"
                            disabled={isUpdatingStep}
                          >
                            {isUpdatingStep ? (
                              <span className="loading loading-dots loading-xs"></span>
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                          <button
                            className="text-gray-500"
                            onClick={handleCancelEdit}
                            title="Cancel"
                          >
                            <IoIosClose className="text-3xl text-base-content" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base-content w-[90%] font-medium">
                            {step.description}
                          </span>
                          <div className="flex items-center gap-2">
                            {step.completed ? (
                              <div className="bg-green-500 text-white px-2 py-2 text-sm rounded-full font-medium">
                                <FaCheck />
                              </div>
                            ) : (
                              isOwner() && (
                                <button
                                  className="bg-yellow text-darkgrey px-6 py-1 text-sm rounded font-medium"
                                  onClick={() => handleCompleteStep(step._id)}
                                  title="Edit"
                                  disabled={updatingStepId === step._id}
                                >
                                  {updatingStepId === step._id ? (
                                    <span className="loading loading-dots loading-xs"></span>
                                  ) : (
                                    "Complete"
                                  )}
                                </button>
                              )
                            )}
                            {!step.completed && isOwner() && (
                              <button
                                className="ml-2 text-teal-500"
                                onClick={() => handleEditStep(idx)}
                                title="Edit"
                              >
                                <TbEdit className="text-2xl text-teal-500" />
                              </button>
                            )}

                            <button
                              className="ml-2 text-teal-500"
                              onClick={() => {
                                const drawer = document.getElementById(
                                  "step-comment-drawer",
                                ) as HTMLInputElement | null;
                                if (drawer) {
                                  setStepId(step._id);
                                  drawer.checked = true; // Open the drawer
                                }
                              }}
                              title="Comments"
                            >
                              <PiChatsBold size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <div className="flex flex-col  gap-4 bg-darkgrey h-[400px] w-[400px] rounded-md p-8 shadow-xl">
                  <p className="text-white font-semibold text-[18px]">
                    Ratings
                  </p>
                  {user.user_id !== solution.user._id && (
                    <div className="flex flex-col gap-2">
                      {isAuthenticated && (
                        <>
                          <p className="text-white font-medium">Your Rating</p>
                          <div className="flex flex-row gap-2">
                            {[...Array(5)].map((_, index) => {
                              const currentRate = index + 1;
                              return (
                                <div key={index}>
                                  <>
                                    <label>
                                      {isRating ? (
                                        isUpdatingSolutionRating ||
                                        isPostingSolutionRating ? (
                                          <FaStar
                                            size={30}
                                            color={
                                              currentRate <= rating!
                                                ? "#F8B500"
                                                : "white"
                                            }
                                          />
                                        ) : (
                                          <FaStar
                                            size={30}
                                            color={
                                              currentRate <= rating!
                                                ? "#F8B500"
                                                : "white"
                                            }
                                            onClick={() =>
                                              setRating(currentRate)
                                            }
                                            className="cursor-pointer"
                                          />
                                        )
                                      ) : (
                                        <FaStar
                                          size={30}
                                          color={
                                            currentRate <= rating!
                                              ? "#F8B500"
                                              : "white"
                                          }
                                        />
                                      )}
                                    </label>
                                  </>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {!isRating && isAuthenticated && (
                        <button
                          className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium mt-4"
                          onClick={() => setIsRating(true)}
                        >
                          Click to Rate
                        </button>
                      )}
                      {isRating && (
                        <div className="flex gap-4 mt-4">
                          <button
                            className="bg-[red] text-white px-8 py-2 rounded font-medium"
                            onClick={() => setIsRating(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
                            onClick={() => handleRateSolution(rating)}
                            disabled={
                              isPostingSolutionRating ||
                              isUpdatingSolutionRating ||
                              !rating
                            }
                          >
                            {isPostingSolutionRating ||
                            isUpdatingSolutionRating ? (
                              <span className="loading loading-dots loading-xs"></span>
                            ) : (
                              "Rate"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-white font-medium">Overall Rating</p>
                  <div className="flex flex-row gap-2">
                    {[...Array(5)].map((_, index) => {
                      const currentRate = index + 1;
                      return (
                        <div key={index}>
                          <>
                            <label>
                              {/* <input type="radio" name="rate" value={currentRate} onChange={() => setRating(currentRate)} /> */}
                              <FaStar
                                size={30}
                                color={
                                  currentRate <= overallRating!
                                    ? "#F8B500"
                                    : "white"
                                }
                              />
                            </label>
                          </>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-white font-medium">Team Owner Rating</p>
                  <div className="flex flex-row gap-2">
                    {[...Array(5)].map((_, index) => {
                      const currentRate = index + 1;
                      return (
                        <div key={index}>
                          <>
                            <label>
                              {/* <input type="radio" name="rate" value={currentRate} onChange={() => setRating(currentRate)} /> */}
                              <FaStar
                                size={30}
                                color={
                                  currentRate <= mentorRating!
                                    ? "#F8B500"
                                    : "white"
                                }
                              />
                            </label>
                          </>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="hidden md:block absolute bg-transparent border-2 border-teal-500 text-teal-500 px-8 py-2 rounded font-medium right-0 top-0"
              onClick={() => {
                const drawer = document.getElementById(
                  "solution-comment-drawer",
                ) as HTMLInputElement | null;
                if (drawer) {
                  drawer.checked = true; // Open the drawer
                }
              }}
            >
              Comments
            </button>
          </div>
        )}
        {solutionDeleted && (
          <div className="flex flex-col items-center justify-center mb-10 relative gap-4 h-[50vh]">
            <TiDeleteOutline className="text-red-500 text-[150px]" />
            <p className="text-base-content font-body font-semibold text-[18px]">
              Solution deleted successfully
            </p>
            <button
              className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
              onClick={() => navigate(`/challenge/${challengeId}`)}
            >
              Back to Challenge
            </button>
          </div>
        )}
      </div>
      <SubmitSolutionModal
        isOpen={isSubmitSolutionModalOpen}
        onClose={() => setIsSubmitSolutionModalOpen(false)}
        challengeId={challengeId!}
        solutionId={solutionId!}
        setSubmittedSolution={setSubmittedSolution}
      />
      <div className="drawer drawer-end font-body">
        <input
          id="step-comment-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-side z-40">
          <label
            htmlFor="step-comment-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu bg-base-200 text-base-content min-h-full w-[400px] py-4 px-8">
            {/* Sidebar content here */}
            <div className="flex justify-between border-b-[1px] pb-4">
              <p className="text-base-content font-semibold text-[18px]">
                Comments{" "}
                {solution?.comments && solution?.comments.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-darkgrey p-2 rounded-full text-sm font-semibold px-3">
                    {solution?.comments.length}
                  </span>
                )}
              </p>
              <XCircleIcon
                height={26}
                width={26}
                className="cursor-pointer"
                onClick={() => {
                  const drawer = document.getElementById(
                    "step-comment-drawer",
                  ) as HTMLInputElement | null;
                  if (drawer) {
                    drawer.checked = false;
                  }
                }}
              />
            </div>
            {stepCommentsPending ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : stepCommentsError ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p className="text-error">
                  Error loading comments: {stepCommentsError.message}
                </p>
                <button
                  className="btn btn-sm bg-yellow text-darkgrey"
                  onClick={() => refetchStepComments()}
                >
                  Retry
                </button>
              </div>
            ) : !stepComments ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p>Error loading step comments</p>
              </div>
            ) : stepComments.length === 0 ? (
              <>
                <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                  <PiChatsBold size={80} />
                  <p>No step comments</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`py-2 overflow-scroll ${isAuthenticated ? "max-h-[78vh]" : "h-screen"}`}
                >
                  {stepComments.map((comment, index) => (
                    <div className="py-2" key={`${comment._id}-${index}`}>
                      <div className="relative flex items-center p-0">
                        {comment.user?.profile?.profile_picture ? (
                          <img
                            src={comment.user.profile.profile_picture}
                            alt="profile Picture"
                            className="object-cover rounded-full w-10 h-10 overflow-hidden "
                          />
                        ) : (
                          <UserCircleIcon
                            height={42}
                            width={42}
                            className="text-base-content"
                          />
                        )}
                        <p className="font-semibold ml-4 text-[13px]">
                          {comment.user?.profile?.firstName &&
                          comment.user?.profile?.lastName
                            ? comment.user.profile.firstName +
                              " " +
                              comment.user.profile.lastName
                            : comment.user?.profile?.username}
                        </p>

                        {comment.user?._id === user.user_id && (
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
                                    className="px-0 py-0 cursor-pointer flex flex-row items-center space-x-0 hover:bg-gray-200"
                                    onClick={() =>
                                      handleDeleteStepComment(comment._id)
                                    }
                                  >
                                    <TrashIcon
                                      height={50}
                                      width={50}
                                      color="red"
                                      className="hover:bg-transparent"
                                    />
                                    <button
                                      className="text-error font-medium hover:bg-transparent bg-transparent"
                                      disabled={isDeletingStepComment}
                                    >
                                      {isDeletingStepComment ? (
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
                  ))}
                </div>
              </>
            )}
            {isAuthenticated && (
              <label className="form-control absolute w-[85%] bottom-2">
                <div className="relative flex flex-col bg-base-100 rounded-md">
                  <textarea
                    className="textarea h-24 text-[13px] focus:border-none focus:outline-none w-full mb-2"
                    placeholder="Add comment..."
                    onChange={handleStepCommentChange}
                    value={stepComment}
                  ></textarea>
                  <div className="flex justify-end border-t-2 w-[90%] mx-auto">
                    <button
                      className="btn btn-sm bg-yellow text-darkgrey rounded-md text-[13px] font-medium mt-2 mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow"
                      type="submit"
                      onClick={handlePostStepComment}
                      disabled={isAddingStepComment}
                    >
                      {isAddingStepComment ? "Posting..." : "Send"}
                    </button>
                  </div>
                </div>
              </label>
            )}
          </ul>
        </div>
      </div>

      <div className="drawer drawer-end font-body">
        <input
          id="solution-comment-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-side z-40">
          <label
            htmlFor="solution-comment-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu bg-base-200 text-base-content min-h-full w-[400px] py-4 px-8">
            {/* Sidebar content here */}
            <div className="flex justify-between border-b-[1px] pb-4">
              <p className="text-base-content font-semibold text-[18px]">
                Comments{" "}
                {solution?.comments && solution?.comments.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-darkgrey p-2 rounded-full text-sm font-semibold px-3">
                    {solution?.comments.length}
                  </span>
                )}
              </p>
              <XCircleIcon
                height={26}
                width={26}
                className="cursor-pointer"
                onClick={() => {
                  const drawer = document.getElementById(
                    "solution-comment-drawer",
                  ) as HTMLInputElement | null;
                  if (drawer) {
                    drawer.checked = false;
                  }
                }}
              />
            </div>
            {solutionCommentsPending ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : solutionCommentsError ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p className="text-error">
                  Error loading comments: {solutionCommentsError.message}
                </p>
                <button
                  className="btn btn-sm bg-yellow text-darkgrey"
                  onClick={() => refetchSolutionComments()}
                >
                  Retry
                </button>
              </div>
            ) : !solutionComments ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p>Error loading solution comments</p>
              </div>
            ) : solutionComments.length === 0 ? (
              <>
                <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                  <PiChatsBold size={80} />
                  <p>No solution comments</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`py-2 overflow-scroll ${isAuthenticated ? "max-h-[78vh]" : "h-screen"}`}
                >
                  {solutionComments.map((comment, index) => (
                    <div className="py-2" key={`${comment._id}-${index}`}>
                      <div className="relative flex items-center p-0">
                        {comment.user?.profile?.profile_picture ? (
                          <img
                            src={comment.user.profile.profile_picture}
                            alt="profile Picture"
                            className="object-cover rounded-full w-10 h-10 overflow-hidden "
                          />
                        ) : (
                          <UserCircleIcon
                            height={42}
                            width={42}
                            className="text-base-content"
                          />
                        )}
                        <p className="font-semibold ml-4 text-[13px]">
                          {comment.user?.profile?.firstName &&
                          comment.user?.profile?.lastName
                            ? comment.user.profile.firstName +
                              " " +
                              comment.user.profile.lastName
                            : comment.user?.profile?.username}
                        </p>

                        {comment.user?._id === user.user_id && (
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
                                    className="px-0 py-0 cursor-pointer flex flex-row items-center space-x-0 hover:bg-gray-200"
                                    onClick={() =>
                                      handleDeleteSolutionComment(comment._id)
                                    }
                                  >
                                    <TrashIcon
                                      height={50}
                                      width={50}
                                      color="red"
                                      className="hover:bg-transparent"
                                    />
                                    <button
                                      className="text-error font-medium hover:bg-transparent bg-transparent"
                                      disabled={isDeletingSolutionComment}
                                    >
                                      {isDeletingSolutionComment ? (
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
                  ))}
                </div>
              </>
            )}

            {isAuthenticated && (
              <label className="form-control absolute w-[85%] bottom-2">
                <div className="relative flex flex-col bg-base-100 rounded-md">
                  <textarea
                    className="textarea h-24 text-[13px] focus:border-none focus:outline-none w-full mb-2"
                    placeholder="Add comment..."
                    onChange={handleSolutionCommentChange}
                    value={solutionComment}
                  ></textarea>
                  <div className="flex justify-end border-t-2 w-[90%] mx-auto">
                    <button
                      className="btn btn-sm bg-yellow text-darkgrey rounded-md text-[13px] font-medium mt-2 mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow"
                      type="submit"
                      onClick={handleAddSolutionComment}
                      disabled={isAddingSolutionComment}
                    >
                      {isAddingSolutionComment ? "Posting..." : "Send"}
                    </button>
                  </div>
                </div>
              </label>
            )}
          </ul>
        </div>
      </div>
      <button
        className="flex items-center pl-2 h-[50px] w-[105px] bg-black bottom-28 -right-8 md:hidden z-30 rounded-full fixed "
        onClick={() => {
          const drawer = document.getElementById(
            "solution-comment-drawer",
          ) as HTMLInputElement | null;
          if (drawer) {
            drawer.checked = true;
          }
        }}
      >
        <ChatBubbleOvalLeftIcon width={30} height={30} color="white" />{" "}
        <span className="text-white font-body ml-1 font-semibold">
          {solutionComments &&
            solutionComments.length > 0 &&
            solutionComments.length}
        </span>
      </button>
    </>
  );
};

export default ChallengeSolutionPage;
