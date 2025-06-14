import { useEffect } from "react";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "superadmin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold mb-6 text-darkgrey text-3xl font-heading">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Users</h2>
            <p>Manage user accounts and permissions</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Users</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Teams</h2>
            <p>Manage teams and team members</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Teams</button>
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Challenges</h2>
            <p>Manage challenges and submissions</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Challenges</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
