import { useEffect, useState } from "react";
import lebron from "../assets/Mask group.svg";
import ChallengesCard from "../components/ChallengesCard";
import MemberCard from "../components/MemberCard";
import useTeamStore from "../stores/useTeamStore";
import { useParams } from "react-router-dom";
import Team from "../entities/Team";
import TeamMember from "../entities/TeamMember";

const TeamDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("members");
  const { teamId } = useParams<{ teamId: string }>();
  const {
    teamDetails,
    fetchTeamData, // Updated to use the combined fetch function
    challenges,
    requests,
  } = useTeamStore();

  useEffect(() => {
    if (teamId) {
      fetchTeamData(teamId); // Fetch all data at once
    }
  }, [teamId, fetchTeamData]);

  const teamData: Team | undefined = teamId ? teamDetails[teamId] : undefined;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen text-darkgrey px-[20px]">
      <div className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white w-full mt-[20px] h-[200px] rounded-[3px] font-body">
        <div className="card-body">
          <div className="flex justify-between w-full">
            <div>
              <h2 className="font-medium mb-5">{teamData?.name}</h2>
              <p className="mb-3">Specialization</p>
              <p>
                {teamData?.subdomain}. {teamData?.subdomainTopics.join(", ")}
              </p>
            </div>
            <div className="text-center flex-col align-middle justify-center">
              <img className="mb-3" src={lebron} alt="img" />
              <p>{teamData?.members[0]?.username}</p>
              <p className="text-center text-[12px]">Owner</p>
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-bordered max-w-md ml-0 mt-4">
        {["members", "challenges", "requests"].map((tab) => (
          <button
            key={tab}
            role="tab"
            className={`tab border-b-2 ${activeTab === tab ? "border-b-4" : "border-transparent"}`}
            style={{
              borderColor:
                activeTab === tab ? "rgba(248, 181, 0, 1)" : "transparent",
            }}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
            {/* Capitalize first letter */}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "members" && (
          <div className="flex gap-2">
            {teamData?.members.map((member: TeamMember) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        )}
        {activeTab === "challenges" && (
          <div>
            {challenges.map((challenge) => (
              <ChallengesCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        )}
        {activeTab === "requests" && (
          <div className="flex gap-2">
            {requests.map((request) => (
              <MemberCard key={request._id} member={request.userProfile} /> // Assuming request has userProfile similar to TeamMember
            ))}
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
