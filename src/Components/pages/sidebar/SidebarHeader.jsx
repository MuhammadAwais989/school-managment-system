import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import avatar from "../../../assets/images/avatar.jfif";

const SidebarHeader = ({ sideBar, toggleSidebar }) => (
  <div className="flex justify-between px-4 py-5 mt-3 relative h-24">
    <div className={`flex rounded-full gap-x-4 ${sideBar ? "w-full" : "justify-center w-12"}`}>
      <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
      {sideBar && (
        <div className="w-full">
          <h2>Muhammad Awais</h2>
          <h4>Designation</h4>
        </div>
      )}
    </div>
    {sideBar && (
      <div onClick={toggleSidebar} className="text-xl shadow-md absolute -right-3 text-white p-1 cursor-pointer bg-rose-700/80 rounded-full">
        <IoIosArrowBack />
      </div>
    )}
  </div>
);

export default SidebarHeader;
