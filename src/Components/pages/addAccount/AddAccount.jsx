import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";

import Sidebar from "../sidebar/SideBar";
import PopupModel from "./PopupModel";
import ViewPopup from "./ViewPopup";
import ConfirmDeletePopup from "./DeletePopup";
import { BaseURL } from "../../helper/helper";
import { showSuccess, showError } from "../../utils/Toast";

const AddAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${BaseURL}/addaccount`)
      .then(res => setUserList(res.data))
      .catch(err => console.error("User Fetch Error:", err));
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const dataToExport = getFilteredData().map(user => ({
      'Name': user.name,
      'Father Name': user.fatherName,
      'Designation': user.designation,
      'Date of Joining': user.dateOfJoining,
      'Class': user.Class,
      'Section': user.section,
      'Salary': user.salary,
      'Gender': user.gender,
      'Last Qualification': user.last_qualification,
      'Date of Birth': user.dateOfBirth,
      'CNIC No': user.CNIC_No,
      'Phone': user.phone,
      'Email': user.email,
      'Address': user.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Users_Data.xlsx");
    showSuccess("Data exported to Excel successfully");
  };

  const getFilteredData = () => {
    const filtered = userList.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const exactA = a.name.toLowerCase() === searchTerm.toLowerCase();
      const exactB = b.name.toLowerCase() === searchTerm.toLowerCase();
      return exactA ? -1 : exactB ? 1 : 0;
    });
  };

  const handleView = user => {
    setSelectedUser(user);
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleEdit = user => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = user => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BaseURL}/addaccount/${userToDelete._id}`);
      setUserList(prev => prev.filter(u => u._id !== userToDelete._id));
      showSuccess("User deleted successfully");
    } catch (error) {
      showError("Delete failed");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4">
          {/* Header Controls */}
          <div className="flex items-center justify-between py-4 flex-wrap gap-3">
            <div className="flex items-center bg-[#F8F8F8] rounded px-3 py-2 flex-grow max-sm:w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                className="outline-none bg-[#F8F8F8] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Export to Excel Button */}
              <button
                onClick={exportToExcel}
                className="flex items-center bg-teal-500 text-white px-4 py-2.5 rounded-md hover:bg-teal-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                <span className="hidden sm:inline">Export To Excel</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
              >
                <FaPlus className="mr-2" /> Add Account
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto h-[calc(100vh-155px)] max-sm:h-[calc(100vh-160px)] scrollbar-hide">
            <table className="min-w-full table-auto bg-white border border-gray-300">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-center">
                <tr>
                  {['', 'Photo', 'Name', 'Father Name', 'Designation', 'Date of Joining', 'Class', 'Section', 'Salary', 'Gender', 'Last Qualification','Date of Birth', 'CNIC No', 'Phone', 'Email', 'Address', 'Actions'].map((title, idx) => (
                    <th key={idx} className="border px-3 py-3 whitespace-nowrap">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getFilteredData().map((user, index) => (
                  <tr
                    key={user._id}
                    className={`text-center text-sm transition ${index % 2 ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50`}
                  >
                    <td className="border px-3 py-1 text-gray-400">{index + 1}</td>
                    <td className="border px-3 py-1">
                      <img src={user.profilePic} alt="Profile" className="h-10 w-10 object-cover rounded-full mx-auto" />
                    </td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.name}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.fatherName}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.designation}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.dateOfJoining}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.Class}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.section}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.salary}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.gender}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.last_qualification}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.dateOfBirth}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.CNIC_No}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.phone}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.email}</td>
                    <td className="border px-3 py-1 text-gray-500 truncate w-fit">{user.address}</td>
                    <td className="px-3 py-1 flex justify-center items-center gap-4 text-lg h-12">
                      <button title="View" className="text-blue-500 hover:text-blue-700" onClick={() => handleView(user)}><FaEye /></button>
                      <button title="Edit" className="text-green-500 hover:text-green-700" onClick={() => handleEdit(user)}><FaEdit /></button>
                      <button title="Delete" className="text-red-500 hover:text-red-700" onClick={() => confirmDelete(user)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <PopupModel
          isModalOpen={isModalOpen}
          onclose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedUser(null);
            fetchUsers();
          }}
          editMode={isEditMode}
          existingData={selectedUser}
        />
      )}

      {isViewModalOpen && selectedUser && (
        <ViewPopup
          data={selectedUser}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          title="User Details"
          imageKey="profilePic"
          fields={[
            { label: "Name", key: "name" },
            { label: "Father Name", key: "fatherName" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phone" },
            { label: "Designation", key: "designation" },
            { label: "Class", key: "Class" },
            { label: "Section", key: "section" },
            { label: "Salary", key: "salary" },
            { label: "Gender", key: "gender" },
            { label: "Last Qualification", key: "last_qualification" },
            { label: "Date of Birth", key: "dateOfBirth" },
            { label: "CNIC No", key: "CNIC_No" },
            { label: "Joining Date", key: "dateOfJoining" },
            { label: "Address", key: "address", fullWidth: true }
          ]}
        />
      )}

      <ConfirmDeletePopup
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
};

export default AddAccount;