import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

function AppLayout() {
  return (
    <>
      <NavigationBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
