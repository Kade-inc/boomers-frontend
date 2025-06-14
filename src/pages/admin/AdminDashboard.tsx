import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { MdDomain } from "react-icons/md";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout: storeLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      const res = await logout();
      console.log(res);
      storeLogout();
      navigate("/admin");
    } catch (err) {
      console.log(err);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300 lg:hidden">
          <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <div className="flex-1 px-2 mx-2 text-xl font-bold">
            Admin Dashboard
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 bg-base-100 min-h-screen">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-200 w-64 min-h-screen">
          <div className="p-4 text-xl font-bold border-b border-base-300">
            Admin Panel
          </div>
          <ul className="menu p-4">
            <li>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/teams"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Teams
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/challenges"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Challenges
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dashboard/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Users
              </NavLink>
            </li>
            <li className="hover:bg-gray-100 hover:rounded-lg">
              <NavLink
                to="/admin/dashboard/domains"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdDomain className="h-5 w-5" />
                Domains
              </NavLink>
            </li>
            <li>
              <div
                className="hover:bg-red-500 hover:text-white"
                onClick={() => {
                  handleLogout();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
