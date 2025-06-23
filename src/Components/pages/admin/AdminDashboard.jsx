import React from "react";

import SideBar from "../sidebar/SideBar";
import DashboardContent from "../student/StudentCard";

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
