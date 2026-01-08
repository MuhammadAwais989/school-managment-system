import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiMenuUnfoldFill } from "react-icons/ri";
import axios from "axios";
import { BaseURL } from "../../helper/helper";
import { HiMenuAlt3 } from 'react-icons/hi';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useActivities } from "../../../Context/Activities.Context.js"; 
import { showSuccess } from '../../utils/Toast.js';

const MobileHeader = ({ toggleSidebar }) => {
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addActivity } = useActivities(); 

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
    //  Logout activity add karein
    const userName = localStorage.getItem("userName") || user?.name || "Unknown User";
    const role = localStorage.getItem("role") || "Unknown Role";
    const userEmail = localStorage.getItem("userEmail") || "Unknown Email";

    addActivity({
      type: "logout",
      title: "User Logout",
      description: `${userName} (${role}) logged out from the system`,
      user: userName,
      metadata: {
        role: role,
        email: userEmail,
        logoutTime: new Date().toLocaleTimeString(),
        logoutDate: new Date().toLocaleDateString()
      }
    });


    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("classAssigned");
    localStorage.removeItem("classSection");
    localStorage.removeItem("teacherClass");

    showSuccess("Logged out successfully");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <>
      <div
        className={`
          sm:hidden 
          h-16 
          mx-2 
          my-2
          flex 
          justify-between 
          items-center 
          bg-white/30
          backdrop-blur-md
          rounded-2xl
          border border-gray-200/50
          shadow-sm
          px-6
          transition-all 
          duration-300 
        `}
      >
        {/* Left Section - Menu Icon*/}
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100/70 rounded-xl transition-colors"
          aria-label="Toggle navigation menu"
        >
          <HiMenuAlt3 className="text-xl text-gray-700" />
        </button>

        {/* Center Section - School Title */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
            City School
          </h1>
          <p className="text-xs text-gray-600 mt-0.5 font-medium">
            Excellence in Education
          </p>
        </div>

        {/* Right Section - User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-full transition-all"
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            <img
              className="w-9 h-9 rounded-full object-cover border border-gray-300 hover:border-gray-400 transition-colors"
              src={user.profilePic}
              alt={`${user.name || 'User'} profile picture`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40?text=U';
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-200/70 shadow-lg rounded-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100/50 bg-gray-50/30">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role || localStorage.getItem("role") || 'User'}
                </p>
              </div>
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 transition-colors flex items-center text-gray-700 text-sm"
              >
                <FiUser className="w-4 h-4 mr-3 text-gray-500" />
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 transition-colors flex items-center text-red-600 text-sm"
              >
                <FiLogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileHeader;