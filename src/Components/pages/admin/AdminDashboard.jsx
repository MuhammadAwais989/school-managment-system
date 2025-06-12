import React from "react";
import SideBar from "../sidebar/SideBar";
import DashboardContent from "./StudentCard";

const AdminDashboard = () => {
  return (
    <>
      <div className="flex max-sm:flex-col">
        <SideBar />
        <DashboardContent />
      </div>
    </>
  );
};

export default AdminDashboard;
