import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaFileExport,
  FaTimes,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import PageTitle from "../PageTitle";
import Sidebar from "../sidebar/SideBar";
import StudentAdPopup from "./StudentAdPopup";
import ViewPopup from "../addAccount/ViewPopup";
import ConfirmDeletePopup from "../addAccount/DeletePopup";
import { BaseURL } from "../../helper/helper";
import { showSuccess, showError } from "../../utils/Toast";
import ExcelExport from "../ExportExcel";
import Loading from "../Loading";

const StudentDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [filters, setFilters] = useState({
    Class: "",
    section: "",
    gender: "",
    religion: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [teacherClass, setTeacherClass] = useState("");
  const [teacherSection, setTeacherSection] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const classOrder = [
    "Nursery",
    "KG-I",
    "KG-II",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Matric",
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const assignedClass = localStorage.getItem("classAssigned");
    const assignedSection = localStorage.getItem("classSection");

    setUserRole(role);
    setTeacherClass(assignedClass || "");
    setTeacherSection(assignedSection || "");

    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BaseURL}/students/details`);
      setAllStudents(res.data);

      const role = localStorage.getItem("role");
      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        const filteredStudents = res.data.filter(
          (student) =>
            student.Class === assignedClass &&
            student.section === assignedSection
        );
        setStudentList(filteredStudents);
      } else {
        setStudentList(res.data);
      }
    } catch (err) {
      console.error("Student Fetch Error:", err);
      showError("Failed to fetch students");
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
      Class: "",
      section: "",
      gender: "",
      religion: "",
    });
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const getFilteredData = () => {
    return studentList
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo.toString().includes(searchTerm) ||
          student.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (student) =>
          (!filters.Class || student.Class === filters.Class) &&
          (!filters.section || student.section === filters.section) &&
          (!filters.gender || student.gender === filters.gender) &&
          (!filters.religion || student.religion === filters.religion)
      );
  };
  const groupedData = () => {
    const sorted = [...getFilteredData()].sort((a, b) => {
      const classA = classOrder.indexOf(a.Class);
      const classB = classOrder.indexOf(b.Class);
      if (classA === classB) {
        return a.section.localeCompare(b.section);
      }
      return classA - classB;
    });
    return sorted;
  };

  // Pagination logic
  const filteredStudents = groupedData();
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Get current students for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsEditMode(false);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${BaseURL}/students/details/${studentToDelete._id}`);
      setStudentList((prev) =>
        prev.filter((s) => s._id !== studentToDelete._id)
      );
      setAllStudents((prev) =>
        prev.filter((s) => s._id !== studentToDelete._id)
      );
      showSuccess("Student deleted successfully");
    } catch (error) {
      showError("Delete failed");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleDownloadPDF = async (student) => {
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = await import("html2canvas");

      const content = document.createElement("div");
      content.style.padding = "20px";
      content.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">Student Details</h2>
        ${
          student.studentPic
            ? `<img src="${student.studentPic}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;" />`
            : ""
        }
        <h3 style="font-size: 20px; margin-bottom: 5px;">${student.name}</h3>
        <p>${student.Class} - Section ${student.section}</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div><strong>Roll No:</strong> ${student.rollNo || "N/A"}</div>
        <div><strong>Name:</strong> ${student.name || "N/A"}</div>
        <div><strong>Father Name:</strong> ${student.fatherName || "N/A"}</div>
        <div><strong>Mother Name:</strong> ${student.motherName || "N/A"}</div>
        <div><strong>Father Occupation:</strong> ${
          student.fatherOccupation || "N/A"
        }</div>
        <div><strong>Gender:</strong> ${student.gender || "N/A"}</div>
        <div><strong>Joining Date:</strong> ${
          student.dateOfJoining || "N/A"
        }</div>
        <div><strong>Class:</strong> ${student.Class || "N/A"}</div>
        <div><strong>Section:</strong> ${student.section || "N/A"}</div>
        <div><strong>Fees:</strong> ${student.Fees || "N/A"}</div>
        <div><strong>Date of Birth:</strong> ${
          student.dateOfBirth || "N/A"
        }</div>
        <div><strong>Age:</strong> ${student.age || "N/A"}</div>
        <div><strong>Religion:</strong> ${student.religion || "N/A"}</div>
        <div><strong>Phone:</strong> ${student.phone || "N/A"}</div>
        <div><strong>CNIC/B-Form:</strong> ${student.CNIC_No || "N/A"}</div>
        <div style="grid-column: 1 / -1;"><strong>Present Address:</strong> ${
          student.presentAddress || "N/A"
        }</div>
        <div style="grid-column: 1 / -1;"><strong>Permanent Address:</strong> ${
          student.permanentAddress || "N/A"
        }</div>
      </div>
    `;

      document.body.appendChild(content);

      const canvas = await html2canvas.default(content);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${student.name}_Details.pdf`);
      document.body.removeChild(content);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showError("Failed to download PDF");
    }
  };

  const mapStudentData = (student) => ({
    "Roll No": student.rollNo || "N/A",
    "Name": student.name || "N/A",
    "Father Name": student.fatherName || "N/A",
    "Mother Name": student.motherName || "N/A",
    "Father Occupation": student.fatherOccupation || "N/A",
    "Gender": student.gender || "N/A",
    "Joining Date": student.dateOfJoining || "N/A",
    "Class": student.Class || "N/A",
    "Section": student.section || "N/A",
    "Fees": student.Fees || "N/A",
    "Date of Birth": student.dateOfBirth || "N/A",
    "Age": student.age || "N/A",
    "Religion": student.religion || "N/A",
    "Phone": student.phone || "N/A",
    "CNIC/B-Form": student.CNIC_No || "N/A",
    "Present Address": student.presentAddress || "N/A",
    "Permanent Address": student.permanentAddress || "N/A",
  });

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
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed before last page
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Agar loading chal raha hai toh Loading component dikhao
  if (isLoading) {
    return (
      <>
        <Sidebar />
        <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-[calc(100vh-56px)] shadow-md rounded-lg px-6 py-4 pt-2 max-sm:px-4">
            <main className="flex-1 overflow-y-auto md:p-2 bg-gray-50">
              <Loading 
                type="skeleton"
                skeletonType="students"
                overlay={false}
                fullScreen={false}
              />
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full min-h-[calc(100vh-56px)] shadow-md rounded-lg px-6 py-4 pt-2 max-sm:px-4">
          {/* Header Section */}
          <PageTitle
            title="Student Details"
            description="Manage all student records"
            showStudentHeader={true}
            userRole={userRole}
            teacherClass={teacherClass}
            teacherSection={teacherSection}
            bgGradient="bg-gradient-to-r from-blue-50 to-indigo-50"
            borderColor="border-blue-100"
            showBorder={true}
          />

          {/* Controls Section */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border border-gray-200 mt-2">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, roll no, or father's name"
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
                <ExcelExport 
                  data={filteredStudents}
                  mappingFunction={mapStudentData}
                  fileName="Students_Data"
                  sheetName="Students"
                  buttonText="Export Excel"
                  disabled={filteredStudents.length === 0}
                />

                {/* Filter Button - Hide for teachers */}
                {userRole !== "Teacher" && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-all ${
                      showFilters
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaFilter className="mr-2" />
                    Filters
                  </button>
                )}

                {/* Add Student Button - Hide for teachers */}
                {userRole !== "Teacher" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <FaPlus className="mr-2" /> Add Student
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Filter Students</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      name="Class"
                      value={filters.Class}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Classes</option>
                      {classOrder.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion
                    </label>
                    <select
                      name="religion"
                      value={filters.religion}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Religions</option>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Other">Other</option>
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
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {studentList.length}
                  </h2>
                  <p className="text-gray-600 text-sm">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {filteredStudents.length}
                  </h2>
                  <p className="text-gray-600 text-sm">Filtered Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {classOrder.length}
                  </h2>
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Roll No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Photo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Father Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Section
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentStudents.length > 0 ? (
                    currentStudents.map((student, index) => (
                      <tr
                        key={student._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={student.studentPic}
                            alt="Student"
                            className="h-10 w-10 object-cover rounded-full"/>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.fatherName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.Class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.gender === "Male"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(student)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {userRole !== "Teacher" && (
                              <>
                                <button
                                  onClick={() => handleEdit(student)}
                                  className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => confirmDelete(student)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDownloadPDF(student)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50 transition-colors"
                              title="Download PDF"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No students found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {userRole === "Teacher"
                            ? "You may not have any students assigned to your class."
                            : "Try adjusting your search or filter to find what you're looking for."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredStudents.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredStudents.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
                students
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
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof pageNumber === "number" && goToPage(pageNumber)
                    }
                    className={`px-3 py-1.5 rounded-md border text-sm ${
                      currentPage === pageNumber
                        ? "border-blue-500 bg-blue-500 text-white"
                        : pageNumber === "..."
                        ? "border-gray-300 bg-white text-gray-700 cursor-default"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    disabled={pageNumber === "..."}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <StudentAdPopup
          isModalOpen={isModalOpen}
          onclose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setSelectedStudent(null);
            fetchStudents();
          }}
          editMode={isEditMode}
          existingData={selectedStudent}
        />
      )}

      {isViewModalOpen && selectedStudent && (
        <ViewPopup
          data={selectedStudent}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedStudent(null);
          }}
          onDownload={() => handleDownloadPDF(selectedStudent)}
          title="Student Details"
          imageKey="studentPic"
          fields={[
            { label: "Name", key: "name" },
            { label: "Father Name", key: "fatherName" },
            { label: "Mother Name", key: "motherName" },
            { label: "Father Occupation", key: "fatherOccupation" },
            { label: "Gender", key: "gender" },
            { label: "Date of Birth", key: "dateOfBirth" },
            { label: "Age", key: "age" },
            { label: "Religion", key: "religion" },
            { label: "Joining Date", key: "dateOfJoining" },
            { label: "Class", key: "Class" },
            { label: "Section", key: "section" },
            { label: "Fees", key: "Fees" },
            { label: "Phone", key: "phone" },
            { label: "CNIC/B-Form", key: "CNIC_No" },
            {
              label: "Present Address",
              key: "presentAddress",
              fullWidth: true,
            },
            {
              label: "Permanent Address",
              key: "permanentAddress",
              fullWidth: true,
            },
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

export default StudentDetails;