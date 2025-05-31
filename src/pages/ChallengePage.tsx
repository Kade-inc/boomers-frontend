import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useChallenge from "../hooks/Challenges/useChallenge";
import useTeam from "../hooks/useTeam";
import { MdDescription, MdOutlineDescription } from "react-icons/md";
import { AiOutlineExperiment, AiFillExperiment } from "react-icons/ai";
import { IoRocketOutline, IoRocket } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  ChatBubbleOvalLeftIcon,
  EllipsisHorizontalIcon,
  PresentationChartBarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FaRegEdit } from "react-icons/fa";
import ChallengeStatsModal from "../components/Modals/ChallengeStatsModal";
import useAuthStore from "../stores/useAuthStore";
import Team from "../entities/Team";
import { UserCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import DeleteChallengeModal from "../components/Modals/DeleteChallengeModal";
import ReactECharts from "echarts-for-react";
import ChallengeCommentsModal from "../components/Modals/ChallengeCommentsModal";
import useChallengeComments from "../hooks/Challenges/useChallengeComments";
import { PiChatsBold } from "react-icons/pi";
import { formatDistanceToNow } from "date-fns";
import useDeleteComment from "../hooks/Challenges/useDeleteComment";
import toast, { Toaster } from "react-hot-toast";
import usePostChallengeComment from "../hooks/Challenges/usePostChallengeComment";
import SolutionDisclaimer from "../components/Modals/SolutionDisclaimer";
import useGetAllChallengeSolutions from "../hooks/ChallengeSolution/useGetAllChallengeSolutions";

function ChallengePage() {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteChallengeModal, setShowDeleteChallengeModal] =
    useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [challengeDeleted, setchallengeDeleted] = useState(false);
  const [showSolutionDisclaimer, setShowSolutionDisclaimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isDue, setIsDue] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const { user } = useAuthStore();

  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();

  const closeStatsModal = () => setShowStatsModal(false);
  const closeDeleteChallengeModal = () => setShowDeleteChallengeModal(false);
  const closeCommentsModal = () => setShowCommentsModal(false);
  const toggleTooltip = (id: string | null) => {
    setActiveTooltip((prev) => (prev === id ? null : id)); // Toggle between opening and closing
  };

  const {
    data: challenge,
    isPending: challengePending,
    error: challengeError,
  } = useChallenge(challengeId || "");
  const {
    data: team,
    isPending: teamPending,
    error: teamError,
  } = useTeam(challenge?.team_id || "");
  const {
    data: comments,
    isPending: commentsPending,
    error: commentsError,
    refetch,
  } = useChallengeComments(challengeId || "");

  const {
    data: solutions,
    isPending: solutionsPending,
    error: solutionsError,
  } = useGetAllChallengeSolutions(challengeId || "");

  // Check if user already has a solution and get it
  const userSolution = useMemo(() => {
    if (!solutions || !user.user_id) return null;
    return solutions.find((solution) => solution.user._id === user.user_id);
  }, [solutions, user.user_id]);

  const hasUserSolution = useMemo(() => {
    return !!userSolution;
  }, [userSolution]);

  const { mutate: postComment, isPending: postCommentIsPending } =
    usePostChallengeComment();

  const deleteCommentMutation = useDeleteComment();

  const isOwner = () => {
    return user.user_id === team?.members[0]._id;
  };

  const isTeamMember = () => {
    const teamMember = team?.members.find(
      (member: Team) => member._id === user.user_id,
    );
    return user.user_id !== team?.members[0]._id && teamMember;
  };

  const tabsList = isTeamMember()
    ? ["description", "solutions", "my plan"]
    : ["description", "solutions"];

  const handleDeleteChallenge = () => {
    setShowDeleteChallengeModal(true);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDeleteComment = async (commentId: string) => {
    const challengeId = challenge?._id || "";
    await deleteCommentMutation.mutateAsync({ challengeId, commentId });
    setActiveTooltip(null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handlePostComment = () => {
    const trimmedComment = comment.trim(); // Remove extra spaces
    if (!trimmedComment) {
      toast.error("Comment cannot be empty!");
      return;
    }

    postComment(
      { challengeId: challenge?._id || "", comment: comment },
      {
        onSuccess: () => {
          setComment("");
        },
      },
    );
  };

  // Calculate time difference and update the state
  useEffect(() => {
    if (!challenge?.due_date) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const dueDate = new Date(challenge.due_date || "").getTime();
      const timeDifference = dueDate - now;

      if (timeDifference > 0) {
        const years = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24 * 365.25),
        ); // Approximating 365.25 days per year (accounting for leap years)
        const months = Math.floor(
          (timeDifference / (1000 * 60 * 60 * 24 * 30)) % 12,
        ); // Remaining months after extracting years
        const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 30); // Remaining days after extracting months
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        setTimeLeft({ years, months, days, hours, minutes, seconds });
      } else {
        setIsDue(true); // Mark as due
        clearInterval(timer);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [challenge?.due_date]);

  const handleBeginChallenge = () => {
    if (hasUserSolution) {
      console.log(userSolution);
      navigate(`/challenge/${challengeId}/solution/${userSolution?._id}`);
    } else {
      setShowSolutionDisclaimer(true);
    }
  };
  if (challengePending || teamPending) {
    return (
      <>
        <div className="h-screen flex justify-center items-center bg-base-100">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </>
    );
  }

  if (challengeError && teamError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-base-content font-body font-medium text-[18px] space-y-2 bg-base-100">
        <p>Error loading challenge data</p>
        <button
          className="btn bg-yellow text-darkgrey hover:bg-yellow"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-base-content font-body font-medium text-[18px] space-y-2 bg-base-100">
        <p>Error fetching challenge</p>
        <button
          className="btn bg-yellow text-darkgrey hover:bg-yellow"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 11,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: solutions?.filter((s) => s.status === 2).length || 0,
            name: "Completed",
          },
          {
            value: solutions?.filter((s) => s.status === 1).length || 0,
            name: "In Progress",
          },
          {
            value:
              (team?.members.filter((m: Team) => m._id !== challenge?.owner_id)
                .length || 0) - (solutions?.length || 0),
            name: "Not Started",
          },
        ],
      },
    ],
    color: ["#FFFFFF", "#F8B500", "#00989B"],
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
        }}
      />

      {!challengeDeleted && (
        <>
          <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center">
                <h1 className="font-heading text-4xl mr-4">
                  <span>{challenge?.challenge_name}</span>
                </h1>
                {isOwner() && (
                  <FaRegEdit
                    size={24}
                    className="cursor-pointer"
                    fill="teal"
                    onClick={() =>
                      navigate(`/edit-challenge/${challenge?._id}`)
                    }
                  />
                )}
              </div>
              <p>{team?.name}</p>

              <div className="border-2 border-base-300 rounded-full px-8 py-1 text-base-300 text-[14px]">
                Due
              </div>
              {isDue ? (
                <div className="text-red-500 text-center">
                  <p>
                    Was due on{" "}
                    {new Date(challenge?.due_date || "").toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                  {/* Years - only show if > 0 */}
                  {timeLeft.years > 0 && (
                    <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                      <span className="countdown text-4xl md:text-5xl font-heading">
                        <span
                          style={
                            { "--value": timeLeft.years } as React.CSSProperties
                          }
                        ></span>
                      </span>
                      years
                    </div>
                  )}
                  {/* Months - only show if > 0 */}
                  {timeLeft.months > 0 && (
                    <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                      <span className="countdown text-4xl md:text-5xl font-heading">
                        <span
                          style={
                            {
                              "--value": timeLeft.months,
                            } as React.CSSProperties
                          }
                        ></span>
                      </span>
                      months
                    </div>
                  )}

                  {/* Days - only show if > 0 */}
                  {timeLeft.days > 0 && (
                    <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                      <span className="countdown text-4xl md:text-5xl font-heading">
                        <span
                          style={
                            { "--value": timeLeft.days } as React.CSSProperties
                          }
                        ></span>
                      </span>
                      days
                    </div>
                  )}

                  {/* Hours - show if days > 0 OR hours > 0 */}
                  {(timeLeft.days > 0 || timeLeft.hours > 0) && (
                    <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                      <span className="countdown text-4xl md:text-5xl font-heading">
                        <span
                          style={
                            { "--value": timeLeft.hours } as React.CSSProperties
                          }
                        ></span>
                      </span>
                      hours
                    </div>
                  )}

                  {/* Minutes - show if days > 0 OR hours > 0 OR minutes > 0 */}
                  {(timeLeft.days > 0 ||
                    timeLeft.hours > 0 ||
                    timeLeft.minutes > 0) && (
                    <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                      <span className="countdown text-4xl md:text-5xl font-heading">
                        <span
                          style={
                            {
                              "--value": timeLeft.minutes,
                            } as React.CSSProperties
                          }
                        ></span>
                      </span>
                      min
                    </div>
                  )}

                  {/* Seconds - always show */}
                  <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                    <span className="countdown text-4xl md:text-5xl font-heading">
                      <span
                        style={
                          { "--value": timeLeft.seconds } as React.CSSProperties
                        }
                      ></span>
                    </span>
                    sec
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-10">
              <div className="w-full md:w-[55%] xl:w-[60%]">
                <div role="tablist" className="tabs tabs-bordered">
                  {tabsList.map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      className={`p-0 md:px-1 tab font-body text-[16px] border-b-2 ${activeTab === tab ? "border-b-4" : "border-transparent"}`}
                      style={{
                        borderColor:
                          activeTab === tab
                            ? "rgba(248, 181, 0, 1)"
                            : "#C3BABA",
                      }}
                      onClick={() => handleTabClick(tab)}
                    >
                      <>
                        <span
                          className={`mr-1 md:mr-4 ${activeTab === tab ? "block" : "hidden lg:block"}`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                        </span>
                        {tab === "description" && activeTab === tab ? (
                          <MdDescription size={20} />
                        ) : (
                          tab === "description" && (
                            <MdOutlineDescription size={20} />
                          )
                        )}
                        {tab === "solutions" && activeTab === tab ? (
                          <AiFillExperiment size={20} />
                        ) : (
                          tab === "solutions" && (
                            <AiOutlineExperiment size={20} />
                          )
                        )}

                        {tab === "my plan" && activeTab === tab ? (
                          <IoRocket size={20} />
                        ) : (
                          tab === "my plan" && <IoRocketOutline size={20} />
                        )}
                      </>
                      {/* Capitalize first letter */}
                    </button>
                  ))}
                </div>
                <div className="mt-6 h-[55vh] overflow-scroll">
                  {activeTab === "description" && (
                    <div className="text-darkgrey">
                      <CKEditor
                        editor={ClassicEditor}
                        data={challenge?.description}
                        disabled={true}
                        config={{
                          toolbar: [],
                        }}
                      />
                    </div>
                  )}
                  {activeTab === "solutions" && (
                    <div className="text-darkgrey">
                      {solutionsPending ? (
                        <div className="flex justify-center items-center h-full">
                          <span className="loading loading-dots loading-lg"></span>
                        </div>
                      ) : solutionsError ? (
                        <div className="flex flex-col justify-center items-center h-full space-y-2">
                          <p className="text-error">
                            Error loading solutions: {solutionsError.message}
                          </p>
                          <button
                            className="btn btn-sm bg-yellow text-darkgrey"
                            onClick={() => refetch()}
                          >
                            Retry
                          </button>
                        </div>
                      ) : solutions && solutions.length > 0 ? (
                        <>
                          <div className="bg-base-200 min-h-[400px] max-h-[500px] overflow-y-scroll p-4">
                            {/* Solutions content */}
                            <div className="flex flex-col items-center justify-center h-full">
                              {solutions.map((solution) => (
                                <Link
                                  key={solution._id}
                                  to={`/challenge/${challengeId}/solution/${solution._id}`}
                                  className="w-full md:w-1/2"
                                >
                                  <div className="flex items-center justify-between border-2 border-teal-500 rounded-md p-4 w-full cursor-pointer gap-4 hover:bg-teal-500 transition-colors hover:text-white text-base-content">
                                    {solution.user.profile.profile_picture ? (
                                      <img
                                        src={
                                          solution.user.profile.profile_picture
                                        }
                                        alt="profile picture"
                                        className="w-10 h-10 rounded-full"
                                      />
                                    ) : (
                                      <UserCircleIcon
                                        height={42}
                                        width={42}
                                        className="text-base-content"
                                      />
                                    )}
                                    <p className="font-semibold">
                                      {solution.user.profile.firstName &&
                                      solution.user.profile.lastName
                                        ? `${solution.user.profile.firstName} ${solution.user.profile.lastName}`
                                        : solution.user.profile.username}
                                      &apos;s Solution
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <p>No solutions yet</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "my plan" && (
                    <div className="text-darkgrey bg-base-200 min-h-[400px] max-h-[500px] overflow-y-scroll p-4">
                      <p className="text-base-content mb-4">My steps</p>
                      <>
                        {userSolution?.steps &&
                          userSolution.steps.length > 0 && (
                            <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 gap-4">
                              {userSolution.steps.map((step, index) => (
                                <div
                                  key={step._id}
                                  className="flex items-center justify-between border-2 border-teal-500 rounded-md p-4 w-full gap-4"
                                >
                                  <p className="text-base-content">
                                    {index + 1}. {step.description}
                                  </p>
                                  {step.completed && (
                                    <p className="text-green-500 font-medium">
                                      Completed
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        {userSolution?.steps &&
                          userSolution.steps.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 gap-4">
                              <p className="text-base-content">No steps yet</p>
                            </div>
                          )}
                      </>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-darkgrey w-[40%] xl:w-1/4 min-h-[450px] rounded-lg py-8 px-8 space-y-4 relative mt-8 hidden md:block">
                <p className="text-white font-normal">
                  {challenge?.difficulty === 1 && "Easy"}
                  {challenge?.difficulty === 2 && "Medium"}
                  {challenge?.difficulty === 3 && "Hard"}
                  {challenge?.difficulty === 4 && "Very Hard"}
                  {challenge?.difficulty === 5 && "Legendary"}
                </p>
                <div className="flex items-center space-x-4">
                  <p className="text-white font-normal">Comments</p>
                  <p className="  bg-white text-darkgrey rounded-full px-4 py-2  bg-base-100 cursor-pointer">
                    <label
                      htmlFor="my-drawer-4"
                      className="drawer-button cursor-pointer"
                    >
                      {comments && comments.length}
                    </label>
                  </p>
                  <button
                    className="bg-yellow px-4 py-1 text-[12px] font-medium rounded-sm text-darkgrey"
                    onClick={() => {
                      const drawer = document.getElementById(
                        "my-drawer-4",
                      ) as HTMLInputElement | null;
                      if (drawer) {
                        drawer.checked = true; // Open the drawer
                      }
                    }}
                  >
                    View
                  </button>
                </div>
                <div className=" mx-auto my-0">
                  <ReactECharts option={option} />
                </div>
                <div className="flex justify-center items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFFFFF]"></div>
                    <span className="text-white text-sm">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F8B500]"></div>
                    <span className="text-white text-sm">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00989B]"></div>
                    <span className="text-white text-sm">Not Started</span>
                  </div>
                </div>
                {isOwner() && (
                  <button
                    className="btn bg-error text-white border-none rounded-md mt-4 w-full"
                    onClick={handleDeleteChallenge}
                  >
                    Delete Challenge
                  </button>
                )}
                {isTeamMember() && !isDue && (
                  <button
                    className="btn bg-yellow text-darkgrey border-none rounded-md mt-4 w-full"
                    onClick={() => handleBeginChallenge()}
                  >
                    {userSolution?.status === 0 && "Begin challenge"}
                    {userSolution?.status === 1 && "Continue"}

                    {userSolution?.status === 2 && "View Solution"}
                  </button>
                )}
              </div>
            </div>
          </div>
          {isTeamMember() && !isDue && (
            <button
              className="py-4 bg-yellow rounded-none font-body text-darkgrey w-full fixed bottom-0 z-30 font-medium md:hidden"
              onClick={() => handleBeginChallenge()}
            >
              {userSolution?.status === 1 ? "Continue" : "Begin Challenge"}
            </button>
          )}

          {isOwner() && (
            <button
              className="py-4 bg-error rounded-none font-body text-white w-full fixed bottom-0 z-30 font-medium md:hidden"
              onClick={handleDeleteChallenge}
            >
              Delete Challenge
            </button>
          )}
          <button
            className="flex items-center pl-2 h-[50px] w-[105px] bg-black bottom-28 -right-8 md:hidden z-30 rounded-full fixed "
            onClick={() => setShowCommentsModal(!showCommentsModal)}
          >
            <ChatBubbleOvalLeftIcon width={30} height={30} color="white" />{" "}
            <span className="text-white font-body ml-1 font-semibold">
              {comments && comments.length > 0 && comments.length}
            </span>
          </button>
          <button
            className="flex items-center pl-4 h-[50px] w-[105px] bg-gradient-to-b from-[#00989B] to-[#005E78] bottom-10 -right-8 md:hidden z-30 rounded-full fixed "
            onClick={() => setShowStatsModal(!showStatsModal)}
          >
            <PresentationChartBarIcon width={30} height={30} color="white" />
          </button>
        </>
      )}
      {challengeDeleted && (
        <>
          <div className="h-screen flex flex-col justify-center items-center text-base-content font-body font-medium text-[18px] space-y-2 bg-base-100">
            <p>Challenge Deleted successfully.</p>
            <button
              className="btn bg-yellow text-darkgrey hover:bg-yellow"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </>
      )}
      <div className="drawer drawer-end font-body">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side z-40">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu bg-base-200 text-base-content min-h-full w-[400px] py-4 px-8">
            {/* Sidebar content here */}
            <div className="flex justify-between border-b-[1px] pb-4">
              <p className="text-base-content font-semibold text-[18px]">
                Comments{" "}
                {comments && comments.length > 0 && (
                  <span className="ml-2 bg-gray-200 text-darkgrey p-2 rounded-full text-sm font-semibold px-3">
                    {comments.length}
                  </span>
                )}
              </p>
              <XCircleIcon
                height={26}
                width={26}
                className="cursor-pointer"
                onClick={() => {
                  const drawer = document.getElementById(
                    "my-drawer-4",
                  ) as HTMLInputElement | null;
                  if (drawer) {
                    drawer.checked = false;
                  }
                }}
              />
            </div>
            {commentsPending ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) : commentsError ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p className="text-error">
                  Error loading comments: {commentsError.message}
                </p>
                <button
                  className="btn btn-sm bg-yellow text-darkgrey"
                  onClick={() => refetch()}
                >
                  Retry
                </button>
              </div>
            ) : !comments ? (
              <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                <p>Error loading comments</p>
              </div>
            ) : comments.length === 0 ? (
              <>
                <div className="py-2 h-[70vh] flex flex-col justify-center items-center space-y-2">
                  <PiChatsBold size={80} />
                  <p>No comments</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`py-2 overflow-scroll ${isOwner() || isTeamMember() ? "h-[70vh]" : "h-[90vh]"}`}
                >
                  {comments.map((comment, index) => (
                    <div className="py-2" key={`${comment._id}-${index}`}>
                      <div className="relative flex items-center p-0">
                        {comment.user.profile?.profile_picture ? (
                          <img
                            src={comment.user.profile?.profile_picture}
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
                                    className="px-0 py-0 cursor-pointer flex flex-row items-center space-x-0 hover:bg-gray-200"
                                    onClick={() =>
                                      handleDeleteComment(comment._id)
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
                  ))}
                </div>
              </>
            )}
            {(isOwner() || isTeamMember()) && (
              <label className="form-control absolute w-[85%] bottom-2">
                <div className="relative flex flex-col bg-base-100 rounded-md">
                  <textarea
                    className="textarea h-24 text-[13px] focus:border-none focus:outline-none w-full mb-2"
                    placeholder="Add comment..."
                    onChange={handleCommentChange}
                    value={comment}
                  ></textarea>
                  <div className="flex justify-end border-t-2 w-[90%] mx-auto">
                    <button
                      className="btn btn-sm bg-yellow text-darkgrey rounded-md text-[13px] font-medium mt-2 mb-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-yellow"
                      type="submit"
                      onClick={handlePostComment}
                      disabled={postCommentIsPending}
                    >
                      {postCommentIsPending ? "Posting..." : "Send"}
                    </button>
                  </div>
                </div>
              </label>
            )}
          </ul>
        </div>
      </div>
      {showStatsModal && challenge && (
        <ChallengeStatsModal
          isOpen={showStatsModal}
          onClose={closeStatsModal}
          challenge={challenge}
          solutions={solutions || []}
          team={team}
          commentsCount={comments?.length || 0}
        />
      )}
      {showCommentsModal && (
        <ChallengeCommentsModal
          isOpen={showCommentsModal}
          onClose={closeCommentsModal}
          comments={comments || []}
          challengeId={challenge?._id || ""}
          comment={comment}
          handlePostComment={handlePostComment}
          handleCommentChange={handleCommentChange}
          postCommentIsPending={postCommentIsPending}
          isTeamMember={isTeamMember}
          isOwner={isOwner}
        />
      )}
      {showDeleteChallengeModal && !challengeDeleted && (
        <DeleteChallengeModal
          isOpen={showDeleteChallengeModal}
          onClose={closeDeleteChallengeModal}
          teamId={team?._id}
          challengeId={challenge?._id || ""}
          setChallengeDeleted={setchallengeDeleted}
        />
      )}
      {showSolutionDisclaimer && (
        <SolutionDisclaimer
          isOpen={showSolutionDisclaimer}
          onClose={() => setShowSolutionDisclaimer(false)}
          challengeId={challenge?._id || ""}
        />
      )}
    </>
  );
}

export default ChallengePage;
