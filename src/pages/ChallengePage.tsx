import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useChallenge from "../hooks/Challenges/useChallenge";
import useTeam from "../hooks/useTeam";
import { MdDescription, MdOutlineDescription } from "react-icons/md";
import { AiOutlineExperiment, AiFillExperiment } from "react-icons/ai";
import { IoRocketOutline, IoRocket } from "react-icons/io5";
import { FaRegComments, FaComments } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function ChallengePage() {
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

  if (!challengeId || (!team && !teamPending)) {
    return (
      <div className="h-screen flex justify-center items-center text-base-content">
        Unable to load theChallenge
      </div>
    );
  }
  if (challengePending || teamPending) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <span className="loading loading-dots loading-md"></span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="font-heading text-[32px]">
            {challenge?.challenge_name}
          </h1>
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
                <span className="countdown text-5xl font-heading">
                  <span
                    style={{ "--value": timeLeft.days } as React.CSSProperties}
                  ></span>
                </span>
                days
              </div>
              <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                <span className="countdown text-5xl font-heading">
                  <span
                    style={{ "--value": timeLeft.hours } as React.CSSProperties}
                  ></span>
                </span>
                hours
              </div>
              <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                <span className="countdown text-5xl font-heading">
                  <span
                    style={
                      { "--value": timeLeft.minutes } as React.CSSProperties
                    }
                  ></span>
                </span>
                min
              </div>
              <div className="flex flex-col p-2 bg-gradient-to-b from-[#D9436D] to-[#F26A4B] rounded-box text-neutral-content text-white">
                <span className="countdown text-5xl font-heading">
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
          <div className="w-3/4 pr-12">
            <div role="tablist" className="tabs tabs-bordered">
              {["description", "solutions", "comments", "my plan"].map(
                (tab) => (
                  <button
                    key={tab}
                    role="tab"
                    className={`tab font-body text-[16px] border-b-2 ${activeTab === tab ? "border-b-4" : "border-transparent"}`}
                    style={{
                      borderColor:
                        activeTab === tab ? "rgba(248, 181, 0, 1)" : "#C3BABA",
                    }}
                    onClick={() => handleTabClick(tab)}
                  >
                    <>
                      <span className="mr-4">
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
                        tab === "solutions" && <AiOutlineExperiment size={20} />
                      )}
                      {tab === "comments" && activeTab === tab ? (
                        <FaComments size={20} />
                      ) : (
                        tab === "comments" && <FaRegComments size={20} />
                      )}
                      {tab === "my plan" && activeTab === tab ? (
                        <IoRocket size={20} />
                      ) : (
                        tab === "my plan" && <IoRocketOutline size={20} />
                      )}
                    </>
                    {/* Capitalize first letter */}
                  </button>
                ),
              )}
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
          <div className="bg-darkgrey w-1/4 min-h-[50vh] rounded-lg pt-8 px-8 space-y-4 relative mt-8">
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
              <button className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4 font-medium">
                Rate this challenge
              </button>
            </div>
            <button className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-sm mt-4 w-[88%] absolute bottom-6 left-6 ">
              Begin challenge
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChallengePage;
