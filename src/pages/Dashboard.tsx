import { useNavigate } from "react-router-dom";
import AdviceCard from "../components/AdviceCard";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>Welcome Home</div>
      <button className="btn" onClick={() => navigate("/auth/login")}>
        Back
      </button>
      < AdviceCard/>
    </>
  );
};

export default Dashboard;
