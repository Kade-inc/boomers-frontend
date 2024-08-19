import { useNavigate } from "react-router-dom";
import AdviceCard from "../components/AdviceCard";
import NavigationBar from "../components/NavigationBar";
import ProfileCard from "../components/ProfileCard";

const Dashboard = () => {
  const navigate = useNavigate();

  const profile = {
    domain: "Software Engineering",
    subdomain: "Full Stack",
    topics: ["React Js", "Node js", "Javascript"],
  };

  const additionalTopics = profile.topics.length - 1;
  return (
    <>
      <div>
        Welcome Home
      </div>
      <button className="btn" onClick={() => navigate("/auth/login")}>
        Back
      </button>
      < AdviceCard/>
      <ProfileCard/>      
      <div className="h-screen ml-3">

        <div className="card bg-gradient-to-b from-[#005E78] to-[#00989B] text-white w-[450px] h-[200px] rounded-[3px] font-body">
          <div className="card-body">
            <div className="flex justify-between w-full items-center">
              <h2 className="font-medium">Paul and the Funky Bunch</h2>
              <p className="text-right text-[12px]">Member</p>
            </div>
            <div className="flex justify-between w-full mt-[55px]">
              <div className="flex-grow text-[12px]">
                <div>
                  {profile.domain} . {profile.subdomain} . {profile.topics[0]}{" "}
                  {additionalTopics > 0 && `+${additionalTopics}`}
                </div>
                <div>Very Active</div>
              </div>
              <div className=" flex mt-[-20px] mr-2.5">
                <h2 className="font-normal rotate-[-90deg] origin-top-right whitespace-nowrap">
                  5 Members
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
