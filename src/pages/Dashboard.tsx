import { useNavigate } from "react-router-dom";
import AdviceCard from "../components/AdviceCard";
import ProfileCard from "../components/ProfileCard";
// import TeamCard from "../components/TeamCard";

const Dashboard = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className="text-base-content bg-base-100">Welcome Home</div>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/auth/login")}
      >
        Back
      </button>
      <AdviceCard />
      <ProfileCard />
    </>
  );
};

export default Dashboard;
