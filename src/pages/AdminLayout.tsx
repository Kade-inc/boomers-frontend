import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen font-body">
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
