import React from "react";
import { useLocation } from "react-router-dom";
import { RiMenuUnfoldFill } from "react-icons/ri";

const MobileHeader = ({ toggleSidebar, avatar }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const pageTitle = getTitleFromPath(pathname);

  function getTitleFromPath(pathname) {
    switch (pathname) {
      case "/teacher-dashboard":
        return "Dashboard";
      case "/students/attendence":
        return "Student Attendance";
      case "/students/details":
        return "Students Details";
      case "/teacher/details":
        return "Teachers Details";
      case "/accounts/income":
        return "Income";
      case "accounts/expenses":
        return "Expense";
      case "/accounts/balancesheet":
        return "Balance Sheet";
      case "/addaccount":
        return "Add Accounts";
      default:
        return "Dashboard";
    }
  }

  return (
    <>
      <div
        className={`h-10 px-4 flex justify-between items-center bg-gray-50 transition-all duration-300 mt-3 sm:ml-24 lg:ml-24 xl:ml-24 absolute max-sm:static`}
      >
        <div onClick={toggleSidebar} className="sm:hidden">
          <RiMenuUnfoldFill className="text-2xl" />
        </div>

        <div className={`rounded-full sm:hidden`}>
          <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
        </div>
      </div>

      <div className="sm:absolute left-28 top-4 bg-gray-50">
        <h1 className="font-bold text-black text-2xl">{pageTitle}</h1>
      </div>
    </>
  );
};

export default MobileHeader;
