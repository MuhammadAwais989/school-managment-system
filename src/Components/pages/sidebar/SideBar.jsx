import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import SidebarHeader from './SidebarHeader';
import SidebarNavItem from "./SidebarNavItem";
import SidebarLogout from "./SidebarLogout";
import { navItem } from "./NavData";
import avatar from "../../../assets/images/avatar.jfif";
import MobileHeader from "./MobileHeader";
import { useNavigate } from "react-router-dom";
import { showSuccess } from '../../utils/Toast.js';


const Sidebar = () => {
  const [sideBar, setSideBar] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeItemId, setActiveItemId] = useState(1); 

  const toggleSidebar = () => setSideBar(!sideBar);

  const toggleItemExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const navigate = useNavigate()
  const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("role")
    showSuccess("Logged out successfully");

    navigate("/");
  };

  return (
    <>
      <div
        className={`h-screen transition-all duration-300 z-50 fixed left-0${
          sideBar ? "w-72" : "w-20"
        } backdrop-blur-md bg-white/30 shadow-xl rounded-xl max-lg:fixed max-sm:fixed top-2 lg:left-0 ${
          sideBar ? "block " : "max-sm:-translate-x-full"
        }`}
      >
        <SidebarHeader sideBar={sideBar} toggleSidebar={toggleSidebar} />
        <ul className="mt-2 px-3 overflow-y-scroll scrollbar-hide h-[70%]">
          {navItem.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              sideBar={sideBar}
              expandedItems={expandedItems}
              toggleItemExpand={toggleItemExpand}
              activeItemId={activeItemId}          
              setActiveItemId={setActiveItemId}    
            />
          ))}
        </ul>
        <SidebarLogout sideBar={sideBar} handleLogout={handleLogout} />
      </div>

      {!sideBar && (
        <div
          onClick={toggleSidebar}
          className="text-xl z-50 shadow-md fixed lg:left-16 max-lg:left-16 top-12 text-white p-1 cursor-pointer bg-rose-700/80 rounded-full max-sm:hidden"
        >
          <IoIosArrowForward />
        </div>
      )}
      <MobileHeader 
      toggleSidebar={toggleSidebar}
      avatar={avatar}
      />
     
      
    </>
  );
};

export default Sidebar;
