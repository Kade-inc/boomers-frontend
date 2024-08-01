import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>Welcome Home</div>
      <button className="btn" onClick={() => navigate("/login")}>
        Back
      </button>
    </>
  );
};

export default Dashboard;
