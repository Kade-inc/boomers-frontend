import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useChallenge from "../hooks/Challenges/useChallenge";
import useTeam from "../hooks/useTeam";
import { MdDescription, MdOutlineDescription } from "react-icons/md";
import { AiOutlineExperiment, AiFillExperiment } from "react-icons/ai";
import { IoRocketOutline, IoRocket } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  ChatBubbleOvalLeftIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import ChallengeStatsModal from "../components/Modals/ChallengeStatsModal";
import useAuthStore from "../stores/useAuthStore";
import Team from "../entities/Team";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import DeleteChallengeModal from "../components/Modals/DeleteChallengeModal";

function ChallengePage() {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteChallengeModal, setShowDeleteChallengeModal] =
    useState(false);
  const [challengeDeleted, setchallengeDeleted] = useState(false);

  const navigate = useNavigate();
  const closeStatsModal = () => setShowStatsModal(false);
  const closeDeleteChallengeModal = () => setShowDeleteChallengeModal(false);
  const { challengeId } = useParams<{ challengeId: string }>();
  const { data: challenge, isPending: challengePending } = useChallenge(
    challengeId || "",
  );
  const { data: team, isPending: teamPending } = useTeam(
    challenge?.team_id || "",
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isDue, setIsDue] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const { user } = useAuthStore();
  // Calculate time difference and update the state
  useEffect(() => {
    if (!challenge?.due_date) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const dueDate = new Date(challenge.due_date || "").getTime();
      const timeDifference = dueDate - now;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsDue(true); // Mark as due
        clearInterval(timer);
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [challenge?.due_date]);

  if (challengePending || (challenge && teamPending)) {
    return (
      <>
        <div className="h-screen flex justify-center items-center bg-base-100 h-screen">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </>
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

  return (
    <>
      {!challengeDeleted && (
        <>
          <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center">
                <h1 className="font-heading text-4xl mr-4">
                  <span>{challenge?.challenge_name}</span>
                </h1>
                {isOwner() && (
                  <PencilSquareIcon
                    height={28}
                    width={28}
                    color="teal"
                    className="cursor-pointer"
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
                  <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                    <span className="countdown text-4xl  md:text-5xl font-heading">
                      <span
                        style={
                          { "--value": timeLeft.hours } as React.CSSProperties
                        }
                      ></span>
                    </span>
                    hours
                  </div>
                  <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                    <span className="countdown text-4xl  md:text-5xl font-heading">
                      <span
                        style={
                          { "--value": timeLeft.minutes } as React.CSSProperties
                        }
                      ></span>
                    </span>
                    min
                  </div>
                  <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                    <span className="countdown text-4xl  md:text-5xl font-heading">
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
                </div>
              </div>
              <div className="bg-darkgrey w-[40%] xl:w-1/4 h-[400px] rounded-lg pt-8 px-8 space-y-4 relative mt-8 hidden md:block">
                <p className="text-white font-normal">
                  {challenge?.difficulty === 1 && "Easy"}
                  {challenge?.difficulty === 2 && "Medium"}
                  {challenge?.difficulty === 3 && "Hard"}
                  {challenge?.difficulty === 4 && "Very Hard"}
                  {challenge?.difficulty === 5 && "Legendary"}
                </p>
                {/* Add functionality on the backend to rate a team then uncomment this code. */}
                {/* <div>
              <div className="flex items-center justify-between lg:w-[90%] xl:w-[3/4]">
              <p onClick={() => selectRatingType('averageRating')}  className={`font-semibold text-white cursor-pointer ${displayedRating === 'averageRating' && isTeamMember()  ? 'border px-4 py-1 rounded' : ''}`}>Average rating</p>
              {isTeamMember() && <p onClick={() => selectRatingType('myRating')} className={`font-semibold text-white cursor-pointer ${displayedRating === 'myRating' ? 'border px-4 py-1 rounded' : ''}`}>My rating</p>}
              
              </div>
              
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
              {isTeamMember() && displayedRating === 'myRating' && (
                <>
                {isRatingChallenge && <div className="flex items-center justify-between mt-4 lg:w-full">
                <button className="btn bg-error hover:bg-error text-white border-none rounded-sm w-1/2" onClick={() => setIsRatingChallenge(!isRatingChallenge)}>
                  Cancel
                </button>
                <button className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm px-8" onClick={() => setIsRatingChallenge(!isRatingChallenge)}>
                  Submit
                </button>
                </div>}
                {!isRatingChallenge &&  <button className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4 w-full" onClick={() => setIsRatingChallenge(!isRatingChallenge)}>
                  Rate challenge
                </button>}
               
                </>
                
              )}
            </div> */}

                <div className="flex items-center ">
                  <p className="text-white font-normal mr-4">Comments</p>
                  <p className="bg-white rounded-full text-darkgrey w-8 h-8 flex justify-center items-center pl-0.2">
                    34
                  </p>
                </div>
                {isOwner() && (
                  <button
                    className="btn bg-error hover:bg-error text-white border-none rounded-sm mt-4 md:w-[80%] lg:w-[85%] absolute bottom-6 left-8 "
                    onClick={handleDeleteChallenge}
                  >
                    Delete Challenge
                  </button>
                )}
                {isTeamMember() && !isDue && (
                  <button className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4 md:w-[80%] lg:w-[85%] absolute bottom-6 left-8 ">
                    Begin challenge
                  </button>
                )}
              </div>
            </div>
          </div>
          {isTeamMember() && !isDue && (
            <button className="py-4 bg-yellow rounded-none font-body text-darkgrey w-full fixed bottom-0 z-40 font-medium md:hidden">
              Begin Challenge
            </button>
          )}

          {isOwner() && (
            <button
              className="py-4 bg-error rounded-none font-body text-white w-full fixed bottom-0 z-40 font-medium md:hidden"
              onClick={handleDeleteChallenge}
            >
              Delete Challenge
            </button>
          )}
          <button
            className="flex items-center pl-4 h-[50px] w-[100px] bg-black bottom-28 -right-10 md:hidden z-50 rounded-full fixed "
            onClick={() => setShowStatsModal(!showStatsModal)}
          >
            <ChatBubbleOvalLeftIcon width={30} height={30} color="white" />
          </button>
          <button
            className="flex items-center pl-4 h-[50px] w-[100px] bg-gradient-to-b from-[#00989B] to-[#005E78] bottom-10 -right-10 md:hidden z-50 rounded-full fixed "
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
      {showStatsModal && challenge && (
        <ChallengeStatsModal
          isOpen={showStatsModal}
          onClose={closeStatsModal}
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
    </>
  );
}

export default ChallengePage;
