import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter, FaFileExport, FaTimes, FaChevronLeft, FaChevronRight, FaChalkboardTeacher, FaUserGraduate, FaVenusMars, FaMoneyBillWave, FaCalendarAlt, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import * as XLSX from "xlsx";

import Sidebar from "../sidebar/SideBar";
import PopupModel from "../addAccount/PopupModel";
import ViewPopup from "../addAccount/ViewPopup";
import ConfirmDeletePopup from "../addAccount/DeletePopup";
import { BaseURL } from "../../helper/helper";
import { showSuccess, showError } from "../../utils/Toast";

const TeacherDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [filters, setFilters] = useState({
    Class: '',
    section: '',
    gender: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BaseURL}/addaccount`);
      setAllUsers(res.data);
      
      // Filter users with designation "Teacher"
      const teachers = res.data.filter(user => 
        user.designation && user.designation.toLowerCase() === "teacher"
      );
      setTeacherList(teachers);
    } catch (err) {
      console.error("Teacher Fetch Error:", err);
      showError("Failed to fetch teachers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      Class: '',
      section: '',
      gender: ''
    });
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const getFilteredData = () => {
    return teacherList
      .filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.includes(searchTerm)
      )
      .filter((teacher) =>
        (!filters.Class || teacher.Class === filters.Class) &&
        (!filters.section || teacher.section === filters.section) &&
        (!filters.gender || teacher.gender === filters.gender)
      );
  };

  // Pagination logic
  const filteredTeachers = getFilteredData();
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  // Get current teachers for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

  const handleView = teacher => {
    setSelectedTeacher(teacher);
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleEdit = teacher => {
    setSelectedTeacher(teacher);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = teacher => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BaseURL}/addaccount/${teacherToDelete._id}`);
      setTeacherList(prev => prev.filter(t => t._id !== teacherToDelete._id));
      setAllUsers(prev => prev.filter(u => u._id !== teacherToDelete._id));
      showSuccess("Teacher deleted successfully");
    } catch (error) {
      showError("Delete failed");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const dataToExport = filteredTeachers.map(teacher => ({
      'Name': teacher.name,
      'Father Name': teacher.fatherName,
      'Email': teacher.email,
      'Phone': teacher.phone,
      'Designation': teacher.designation,
      'Class': teacher.Class,
      'Section': teacher.section,
      'Salary': teacher.salary,
      'Gender': teacher.gender,
      'Last Qualification': teacher.last_qualification,
      'Date of Birth': teacher.dateOfBirth,
      'CNIC No': teacher.CNIC_No,
      'Joining Date': teacher.dateOfJoining,
      'Address': teacher.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Teachers_Data.xlsx");
    showSuccess("Data exported to Excel successfully");
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(teacherList.map(item => item[key]))].filter(Boolean);
  };

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis if needed after first page
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed before last page
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const classOrder = [
    "Nursery", "KG-I", "KG-II", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Matric"
  ];

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full min-h-[calc(100vh-56px)] shadow-md rounded-lg px-6 py-4 max-sm:px-4">
          {/* Header Section */}
          <div className="flex flex-col mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaChalkboardTeacher className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
                <p className="text-gray-600 mt-1">Manage all teacher accounts and information</p>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teachers by name, email or phone..."
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Button Group */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {/* Export Button */}
                <button
                  onClick={exportToExcel}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaFileExport className="mr-2" />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>

                {/* Add Teacher Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  <FaPlus className="mr-2" /> Add Teacher
                </button>
              </div>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Filter Teachers</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      name="Class"
                      value={filters.Class}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Classes</option>
                      {classOrder.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      name="section"
                      value={filters.section}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Sections</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={filters.gender}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FaChalkboardTeacher className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{teacherList.length}</h2>
                  <p className="text-gray-600 text-sm">Total Teachers</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{filteredTeachers.length}</h2>
                  <p className="text-gray-600 text-sm">Filtered Teachers</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <FaUserGraduate className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{classOrder.length}</h2>
                  <p className="text-gray-600 text-sm">Classes</p>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Loading teacher data...</p>
                      </td>
                    </tr>
                  ) : currentTeachers.length > 0 ? (
                    currentTeachers.map((teacher, index) => (
                      <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={teacher.profilePic || '/default-avatar.png'} alt="Profile" className="h-10 w-10 object-cover rounded-full" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.Class}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(teacher)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => confirmDelete(teacher)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredTeachers.length > 0 && !isLoading && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredTeachers.length)}
                </span> of <span className="font-medium">{filteredTeachers.length}</span> teachers
              </div>

              {/* Items Per Page Selector */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="text-sm text-gray-700 ml-2">entries</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === 1
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                    className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === pageNumber
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : pageNumber === '...'
                        ? 'border-gray-300 bg-white text-gray-700 cursor-default'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    disabled={pageNumber === '...'}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-md border text-sm ${currentPage === totalPages
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <PopupModel
          isModalOpen={isModalOpen}
          onclose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedTeacher(null);
            fetchTeachers();
          }}
          editMode={isEditMode}
          existingData={selectedTeacher}
        />
      )}

      {isViewModalOpen && selectedTeacher && (
        <ViewPopup
          data={selectedTeacher}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTeacher(null);
          }}
          title="Teacher Details"
          imageKey="profilePic"
          fields={[
            { label: "Name", key: "name" },
            { label: "Father Name", key: "fatherName" },
            { label: "Email", key: "email", icon: <FaEnvelope className="text-blue-500 mr-2" /> },
            { label: "Phone", key: "phone", icon: <FaPhone className="text-blue-500 mr-2" /> },
            { label: "Designation", key: "designation", icon: <FaChalkboardTeacher className="text-blue-500 mr-2" /> },
            { label: "Class", key: "Class" },
            { label: "Section", key: "section" },
            { label: "Salary", key: "salary", icon: <FaMoneyBillWave className="text-blue-500 mr-2" /> },
            { label: "Gender", key: "gender", icon: <FaVenusMars className="text-blue-500 mr-2" /> },
            { label: "Last Qualification", key: "last_qualification", icon: <FaUserGraduate className="text-blue-500 mr-2" /> },
            { label: "Date of Birth", key: "dateOfBirth", icon: <FaCalendarAlt className="text-blue-500 mr-2" /> },
            { label: "CNIC No", key: "CNIC_No", icon: <FaIdCard className="text-blue-500 mr-2" /> },
            { label: "Joining Date", key: "dateOfJoining", icon: <FaCalendarAlt className="text-blue-500 mr-2" /> },
            { label: "Address", key: "address", fullWidth: true, icon: <FaMapMarkerAlt className="text-blue-500 mr-2" /> }
          ]}
        />
      )}

      <ConfirmDeletePopup
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        message="Are you sure you want to delete this teacher?"
      />
    </>
  );
};

export default TeacherDetails;