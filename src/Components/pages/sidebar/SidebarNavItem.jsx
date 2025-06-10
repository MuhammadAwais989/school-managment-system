import React from "react";
import { Link } from "react-router-dom";
import SidebarSubItem from "./SidebarSubItem";
import { IoMdArrowDropright } from "react-icons/io";

const SidebarNavItem = ({
  item,
  sideBar,
  expandedItems,
  toggleItemExpand,
  activeItemId,
  setActiveItemId,
}) => {
  const isActive = activeItemId === item.id; // ✅ only this

  const handleClick = () => {
    if (item.children) toggleItemExpand(item.id);
    setActiveItemId(item.id); // ✅ set on click
  };

  return (
    <div>
      <li
        className={`w-full cursor-pointer flex items-center px-3 py-2 mb-1 font-semibold rounded-lg ${
          isActive
            ? "bg-rose-600 text-white"
            : "text-gray-800 hover:bg-gradient-to-r from-rose-200 via-rose-100 to-rose-50"
        }`}
        onClick={handleClick}
      >
        <Link to={item.path || "#"} className="flex items-center w-full">
          <span
            className={`${
              isActive ? "text-white" : "text-rose-600"
            } ${sideBar ? "mx-2 text-lg" : "mx-auto text-2xl"} transition-all duration-300`}
          >
            {item.icon}
          </span>
          {sideBar && (
            <>
              <span className="font-sans text-lg w-full">{item.label}</span>
              {item.children && (
                <span className="ml-auto">
                  {expandedItems[item.id] ? (
                    "▼"
                  ) : (
                    <IoMdArrowDropright className="text-3xl" />
                  )}
                </span>
              )}
            </>
          )}
        </Link>
      </li>

      {sideBar && item.children && (
        <SidebarSubItem
          childrenItems={item.children}
          isOpen={expandedItems[item.id]}
        />
      )}
    </div>
  );
};

export default SidebarNavItem;
