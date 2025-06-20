import React from "react";
import { IoIosLogOut } from "react-icons/io";

const SidebarLogout = ({ sideBar, handleLogout }) => (
  
  <div className="fixed bottom-4 left-0 right-0 px-3 bg-white/30 ">
    <button
      onClick={handleLogout}
      className={`w-full flex items-center px-3 py-2 font-semibold text-gray-800 hover:bg-rose-100 rounded-lg ${
        sideBar ? "justify-start" : "justify-center"
      }`}
    >
      <span className={`text-rose-700 ${sideBar ? "mx-2 text-xl" : "mx-auto text-2xl"}`}>
        <IoIosLogOut />
      </span>
      {sideBar && <span className="font-sans text-lg">Logout</span>}
    </button>
  </div>
);

export default SidebarLogout;
