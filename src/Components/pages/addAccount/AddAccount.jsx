import { FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";
import Sidebar from "../sidebar/SideBar";
import React, { useState, useEffect } from "react";
import PopupModel from "./PopupModel";
import TableComponent from '../TableComponent.jsx';
import { BaseURL } from "../../helper/helper.js";

const AddAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      axios.get(`${BaseURL}/addaccount`)
        .then(res => {
            setUserList(res.data);
        })
        .catch(err => {
          console.log("Frontend User Fetch Data Error", err);
        });
    }, []);

    // Filter and sort data based on search term
    const getFilteredData = () => {
      if (!userList) return [];
      
      const filtered = userList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return [...filtered].sort((a, b) => {
        const aIsExactMatch = a.name.toLowerCase() === searchTerm.toLowerCase();
        const bIsExactMatch = b.name.toLowerCase() === searchTerm.toLowerCase();
        if (aIsExactMatch) return -1;
        if (bIsExactMatch) return 1;
        return 0;
      });
    };

    return (
      <>
        <Sidebar />
        <div className="lg:pl-24 pt-28 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24  max-lg:pl-24 bg-gray-50 w-full h-screen ">
          <div className="bg-white w-full h-full shadow-md rounded-md pt-6 pl-8 pr-8 max-sm:pl-4 max-sm:pr-4">
            <h1 className="text-xl font-sans font-bold inline">Add Account</h1>
            <div className="flex items-center justify-between py-4 rounded max-[436px]:flex-col">
              {/* Search Bar */}
              <div className="flex items-center bg-[#F8F8F8] rounded px-3 py-2 w-60 max-w-md max-[436px]:w-full">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search By Name"
                  className="outline-none bg-[#F8F8F8]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Add Account Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-4 max-[436px]:w-full max-[436px]:ml-0 max-[436px]:mt-3 flex items-center justify-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition">
                <FaPlus className="mr-2"/>
                Add Account
              </button>
              
              {/* Popup Modal */}
              <PopupModel isModalOpen={isModalOpen} onclose={() => setIsModalOpen(false)}/>
            </div>
            
            {/* Table with filtered and sorted data */}
            <div className="overflow-x-auto max-h-[calc(100vh-255px)] scrollbar-hide">
      <table className="min-w-full table-auto bg-white border border-gray-300 ">
        <thead className="bg-gray-100 text-gray-700">
          <tr className="text-sm font-semibold text-center w-fit">
            <th className="border px-3 py-3 whitespace-nowrap"></th>
            <th className="border px-3 py-3 whitespace-nowrap">Photo</th>
            <th className="border px-3 py-3 whitespace-nowrap">Name</th>
            <th className="border px-3 py-3 whitespace-nowrap">Father Name</th>
            <th className="border px-3 py-3 whitespace-nowrap">Designation</th>
            <th className="border px-3 py-3 whitespace-nowrap">Date of Joining</th>
            <th className="border px-3 py-3 whitespace-nowrap">Class</th>
            <th className="border px-3 py-3 whitespace-nowrap">Section</th>
            <th className="border px-3 py-3 whitespace-nowrap">Salary</th>
            <th className="border px-3 py-3 whitespace-nowrap">Gender</th>
            <th className="border px-3 py-3 whitespace-nowrap">Date of Birth</th>
            <th className="border px-3 py-3 whitespace-nowrap">Phone</th>
            <th className="border px-3 py-3 whitespace-nowrap">Email</th>
            <th className="border px-3 py-3 whitespace-nowrap">Address</th>
          </tr>
        </thead>
        <tbody className='overflow-auto'>
          {getFilteredData().map((item, index) => (
            <tr 
              key={index} 
              className={`text-center text-sm hover:bg-gray-50 transition ${
                index % 2 === 1 ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <td className="border px-3 py-1 text-gray-400">{index + 1}</td>
              <td className="border px-3 py-1">
                <img
                  src={item.profilePic}
                  alt="Profile"
                  className="h-10 w-10 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.name}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.fatherName}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.designation}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.dateOfJoining}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.Class}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.section}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.salary}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.gender}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.dateOfBirth}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.phone}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.email}</td>
              <td className="border px-3 py-1 truncate w-fit text-gray-500">{item.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>
        </div>
      </>
    );
};

export default AddAccount;