import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiMenuUnfoldFill } from "react-icons/ri";
import axios from "axios";
import { BaseURL } from "../../helper/helper";

const MobileHeader = ({ toggleSidebar }) => {
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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
      case "/accounts/expenses":
        return "Expense";
      case "/accounts/balancesheet":
        return "Balance Sheet";
      case "/addaccount":
        return "Add Accounts";
      case "/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${BaseURL}/addaccount/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // change route according to your app
  };

  const handleProfile = () => {
    navigate("/profile"); // route where profile details are shown
  };

  return (
    <>
      <div
        className={`h-10 max-sm:h-14 px-4 flex justify-between items-center bg-gray-50 transition-all duration-300 pt-4 sm:ml-20 lg:ml-24 xl:ml-24 absolute max-sm:static`}
      >
        <div onClick={toggleSidebar} className="sm:hidden">
          <RiMenuUnfoldFill className="text-2xl" />
        </div>

        <div className="relative sm:hidden" ref={dropdownRef}>
          <img
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            src={user.profilePic}
            alt="avatar"
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md z-50">
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="sm:absolute left-24 top-4 bg-gray-50">
        <div className="flex items-center space-x-3">
  <div className="p-1.5 text-blue-600">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
    </svg>
  </div>
  <h1 className="max-sm:pl-4 font-bold text-gray-800 text-2xl">
    {pageTitle}
  </h1>
</div>
      </div>
    </>
  );
};

export default MobileHeader;
