import { FaSearch, FaPlus } from "react-icons/fa";
import Sidebar from "../sidebar/SideBar";
import React, { useState } from "react";
import PopupModel from "./PopupModel";


const AddAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const InputData = [
      {
        type: 'input',
        placeholder: 'Name',
      },
    ]
  return (
    <>
      <Sidebar />
      <div className="pl-28 pt-28 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24  max-lg:pl-24 bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md pt-6 pl-8 pr-8">
          <h1 className="text-xl font-sans font-bold">Add Account</h1>
          <div className="flex items-center justify-between py-4 rounded">
            {/* Search Bar */}
            <div className="flex items-center  bg-[#F8F8F8] rounded px-3 py-2 w-60 max-w-md">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                className="outline-none bg-[#F8F8F8]"
              />
            </div>

            {/* Add Account Button */}
            <button
              onClick={() => setIsModalOpen(true)}
             className="ml-4 flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition">
              <FaPlus className="mr-2" />
              Add Account
            </button>
           {/* Popup Modal */}
            <PopupModel isModalOpen={isModalOpen} onclose={() => setIsModalOpen(false)}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAccount;
