import { useNavigate } from "react-router-dom";
import AdviceCard from "../components/AdviceCard";
import NavigationBar from "../components/NavigationBar";
import ProfileCard from "../components/ProfileCard";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
    <NavigationBar />
      <div>Welcome Home</div>
      <button className="btn" onClick={() => navigate("/auth/login")}>
        Back
      </button>
      < AdviceCard/>
      <ProfileCard/>      
    </>
  );
}

export default Dashboard;
