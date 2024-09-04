import AdviceCard from "../components/AdviceCard";
import ProfileCard from "../components/ProfileCard";
import TeamCard from "../components/TeamCard";

const Dashboard = () => {
  return (
    <>
      <div className="h-screen">
        <AdviceCard />
        <ProfileCard />
        <TeamCard />
      </div>
    </>
  );
};

export default Dashboard;
