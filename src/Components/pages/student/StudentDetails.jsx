import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter } from "react-icons/fa";

import Sidebar from "../sidebar/SideBar";
import StudentAdPopup from "./StudentAdPopup";
import ViewPopup from "../addAccount/ViewPopup";
import ConfirmDeletePopup from "../addAccount/DeletePopup";
import { BaseURL } from "../../helper/helper";
import { showSuccess, showError } from "../../utils/Toast";

const StudentDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
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
    religion: "" 
  });
  const [showFilters, setShowFilters] = useState(false);

  const classOrder = [
    "Nursery", "KG-I", "KG-II", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Matric"
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BaseURL}/students/details`);
      setStudentList(res.data);
    } catch (err) {
      console.error("Student Fetch Error:", err);
      showError("Failed to fetch students");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getFilteredData = () => {
    return studentList
      .filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((student) =>
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
      setStudentList((prev) => prev.filter((s) => s._id !== studentToDelete._id));
      showSuccess("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      showError("Delete failed");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md pt-6 px-8 max-sm:px-4">
          <h1 className="text-xl font-bold">Student Details</h1>

          <div className="flex items-center justify-between py-4 gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="flex items-center bg-[#F8F8F8] rounded px-3 py-2 flex-grow w-10 max-sm:w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                className="outline-none bg-[#F8F8F8] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button (Center) */}
            <div className="flex items-center relative max-sm:w-full max-sm:justify-between gap-x-2 ">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md transition-colors"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            

            {/* Add Student Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
            >
              <FaPlus className="mr-2" /> Add Student
            </button>
          {/* Filter Dropdown */}
          {showFilters && (
            <div className="absolute top-12 -left-6 flex flex-col gap-3 items-center px-2 py-3 mb-4 bg-white/70 shadow-md w-fit rounded-lg">
              <select
                name="Class"
                value={filters.Class}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All Classes</option>
                {classOrder.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>

              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                name="religion"
                value={filters.religion}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All Religions</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
          </div>
            </div>
        
          {/* TABLE */}
          <div className="overflow-x-auto h-[calc(100vh-255px)] max-sm:h-[calc(100vh-210px)] scrollbar-hide">
            <table className="min-w-full table-auto bg-white border border-gray-300 ">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-center">
                <tr>
                  {['', 'Photo', 'Name', 'Father Name', 'Mother Name', 'Father Occupation', 'Gender', 'Joining Date', 'Class', 'Section', 'Fees', 'DOB', 'Age', 'Religion', 'Phone', 'CNIC/B-Form', 'Present Address', 'Permanent Address', 'Actions'].map((title, idx) => (
                    <th key={idx} className="border px-3 py-3 whitespace-nowrap">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedData().map((student, index) => (
                  <tr
                    key={student._id}
                    className={`text-center text-sm transition ${index % 2 ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50`}
                  >
                    <td className="border px-3 py-1 text-gray-400">{index + 1}</td>
                    <td className="border px-3 py-1">
                      <img src={student.studentPic} alt="Student" className="h-10 w-10 object-cover rounded-full mx-auto" />
                    </td>
                    <td className="border px-3 py-1">{student.name}</td>
                    <td className="border px-3 py-1">{student.fatherName}</td>
                    <td className="border px-3 py-1">{student.motherName}</td>
                    <td className="border px-3 py-1">{student.fatherOccupation}</td>
                    <td className="border px-3 py-1">{student.gender}</td>
                    <td className="border px-3 py-1">{student.dateOfJoining}</td>
                    <td className="border px-3 py-1">{student.Class}</td>
                    <td className="border px-3 py-1">{student.section}</td>
                    <td className="border px-3 py-1">{student.Fees}</td>
                    <td className="border px-3 py-1 truncate w-fit">{student.dateOfBirth}</td>
                    <td className="border px-3 py-1">{student.age}</td>
                    <td className="border px-3 py-1">{student.religion}</td>
                    <td className="border px-3 py-1">{student.phone}</td>
                    <td className="border px-3 py-1">{student.CNIC_No}</td>
                    <td className="border px-3 py-1 truncate w-fit">{student.presentAddress}</td>
                    <td className="border px-3 py-1 truncate w-fit">{student.permanentAddress}</td>
                    <td className="px-3 py-1 flex justify-center items-center gap-4 text-lg h-12  ">
                      <button title="View" className="text-blue-500 hover:text-blue-700" onClick={() => handleView(student)}><FaEye /></button>
                      <button title="Edit" className="text-green-500 hover:text-green-700" onClick={() => handleEdit(student)}><FaEdit /></button>
                      <button title="Delete" className="text-red-500 hover:text-red-700" onClick={() => confirmDelete(student)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            { label: "Present Address", key: "presentAddress", fullWidth: true },
            { label: "Permanent Address", key: "permanentAddress", fullWidth: true }
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