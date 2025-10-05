import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import avatar from "../../../assets/images/avatar.jfif";
import axios from "axios";
import { BaseURL } from "../../helper/helper";

const SidebarHeader = ({ sideBar, toggleSidebar }) => {
  const [user, setUser] = useState({});

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

  return (
    <div className="flex justify-between px-4 py-5 mt-3 relative h-24 ">
      <div className={`flex  rounded-full gap-x-4 ${sideBar ? "w-full" : "justify-center w-12"}`}>
        <img
          className={`${sideBar ? "w-[68px] h-12 rounded-full object-cover" : "w-12 h-12 rounded-full object-cover"}`}
          src={user.profilePic || avatar}
          alt="avatar"
        />
        {sideBar && (
          <div className="w-full">
            <h2 className="text-base font-semibold">{user.name || "Loading..."}</h2>
            <h4 className="text-sm text-gray-500">{user.designation || ""}</h4>
          </div>
        )}
      </div>
      {sideBar && (
        <div
          onClick={toggleSidebar}
          className="text-xl shadow-md absolute -right-3 text-white p-1 cursor-pointer bg-rose-700/80 rounded-full"
        >
          <IoIosArrowBack />
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
