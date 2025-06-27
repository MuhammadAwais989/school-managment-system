import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

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
    axios.get(`${BaseURL}/addaccount`)
      .then(res => setUserList(res.data))
      .catch(err => console.error("User Fetch Error:", err));
  }, []);

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
      <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md pt-6 px-8 max-sm:px-4">
          <h1 className="text-xl font-bold">Add Account</h1>

          {/* Header Controls */}
          <div className="flex items-center justify-between py-4 flex-wrap gap-3">
            <div className="flex items-center bg-[#F8F8F8] rounded px-3 py-2 w-80 max-w-md flex-grow">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                className="outline-none bg-[#F8F8F8] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
            >
              <FaPlus className="mr-2" /> Add Account
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[calc(100vh-255px)] scrollbar-hide">
            <table className="min-w-full table-auto bg-white border border-gray-300 ">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-center">
                <tr>
                  {['', 'Photo', 'Name', 'Father Name', 'Designation', 'Date of Joining', 'Class', 'Section', 'Salary', 'Gender', 'Date of Birth', 'Phone', 'Email', 'Address', 'Actions'].map((title, idx) => (
                    <th key={idx} className="border px-3 py-3 whitespace-nowrap ">{title}</th>
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
                    <td className="border px-3 py-1 text-gray-500">{user.name}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.fatherName}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.designation}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.dateOfJoining}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.Class}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.section}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.salary}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.gender}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.dateOfBirth}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.phone}</td>
                    <td className="border px-3 py-1 text-gray-500">{user.email}</td>
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
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Joining Date", key: "dateOfJoining" },
    { label: "Address", key: "address", fullWidth: true }
  ]}
/>

      )}

      <ConfirmDeletePopup
  isOpen={isDeleteModalOpen}
  onConfirm={handleConfirmDelete}
  onCancel={() => setIsDeleteModalOpen(false)}
  message="Are you sure you want to delete this student?"
/>

    </>
  );
};

export default AddAccount;
