import { useState } from "react";
import lebron from "../assets/Mask group.svg";
import ChallengesCard from "../components/ChallengesCard";
import MemberCard from "../components/MemberCard";

const TeamDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("members");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen text-darkgrey px-[20px]">
      <div
        className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white w-full mt-[20px]
        h-[200px] rounded-[3px] font-body"
      >
        <div className="card-body">
          <div className="flex justify-between w-full">
            <div>
              <h2 className="font-medium mb-5">Paul and the Funky Bunch</h2>
              <p className="mb-3">Specialization</p>
              <p>Frontend. ReactJs</p>
            </div>
            <div className="text-center flex-col align-middle justify-center">
              <img className="mb-3" src={lebron} alt="img" />
              <p>Paul Vitalis</p>
              <p className="text-center text-[12px]">Owner</p>
            </div>
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-bordered max-w-md ml-0 mt-4">
        <button
          role="tab"
          className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
          onClick={() => handleTabClick("members")}
        >
          Members
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "challenges" ? "tab-active" : ""}`}
          onClick={() => handleTabClick("challenges")}
        >
          Challenges
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "requests" ? "tab-active" : ""}`}
          onClick={() => handleTabClick("requests")}
        >
          Member Requests
        </button>
      </div>
      <div className="mt-5">
        {activeTab === "members" && (
          <div className="flex gap-2">
            <MemberCard />
            <MemberCard />
          </div>
        )}
        {activeTab === "challenges" && <ChallengesCard />}
        {activeTab === "requests" && (
          <div className="flex gap-2">
            <p>No member requests at this time.</p>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-12">
        <button className="w-[98px] text-[14px] p-1 text-white bg-red-600 sm:w-[143px]">
          Leave Team
        </button>
      </div>
    </div>
  );
};

export default TeamDetailsPage;
