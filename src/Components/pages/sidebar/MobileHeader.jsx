import React from "react";
import { RiMenuUnfoldFill } from "react-icons/ri";

const MobileHeader = ({ toggleSidebar, avatar }) => {
  
  return (
    
    <div
      className={`max-sm:w-[95%]  max-sm:mx-auto sm:w-[85%] max-md:w-[90%] lg:w-[92%] mx-auto h-14 px-4 flex justify-between sm:justify-center items-center transition-all duration-300 rounded-2xl bg-white/30 shadow-lg mt-3 mb-4 max-sm:mb-2 sm:ml-24 lg:ml-28 ml-20 xl:ml-24 fixed z-10 max-sm:static`}
    >
      <div onClick={toggleSidebar} className="sm:hidden">
        <RiMenuUnfoldFill className="text-2xl " />
      </div>
      <div>
        <h1 className="font-bold text-gray-700">Dashboard</h1>
      </div>
      <div className={`rounded-full sm:hidden`}>
        <img className="w-12 h-12 rounded-full" src={avatar} alt="avatar" />
      </div>
    </div>
  );
};

export default MobileHeader;