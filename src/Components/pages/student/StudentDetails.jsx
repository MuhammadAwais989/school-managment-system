import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";

import Sidebar from "../sidebar/SideBar";
import StudentAdPopup from "./StudentAdPopup";
import ViewPopup from "../addAccount/ViewPopup";
import ConfirmDeletePopup from "../addAccount/DeletePopup";
import { BaseURL } from "../../helper/helper";
import { showSuccess, showError } from "../../utils/Toast";

const StudentDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students
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
  const [userRole, setUserRole] = useState("");
  const [teacherClass, setTeacherClass] = useState("");
  const [teacherSection, setTeacherSection] = useState("");

  const classOrder = [
    "Nursery", "KG-I", "KG-II", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Matric"
  ];

  useEffect(() => {
    // Get user role and assigned class/section from localStorage
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
      const res = await axios.get(`${BaseURL}/students/details`);
      setAllStudents(res.data);

      // Apply teacher filter immediately if teacher
      const role = localStorage.getItem("role");
      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        const filteredStudents = res.data.filter(student =>
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
      setAllStudents((prev) => prev.filter((s) => s._id !== studentToDelete._id));
      showSuccess("Student deleted successfully");
    } catch (error) {
      showError("Delete failed");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // Function to reset filters and show all students (for admin/principal)
  const resetTeacherFilter = () => {
    setStudentList(allStudents);
    setTeacherClass("");
    setTeacherSection("");
  };

  // Function to apply teacher filter
  const applyTeacherFilter = () => {
    const assignedClass = localStorage.getItem("classAssigned");
    const assignedSection = localStorage.getItem("classSection");

    const filteredStudents = allStudents.filter(student =>
      student.Class === assignedClass &&
      student.section === assignedSection
    );
    setStudentList(filteredStudents);
    setTeacherClass(assignedClass);
    setTeacherSection(assignedSection);
  };

  const handleDownloadPDF = async (student) => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');

      // Create a temporary div to hold the content for PDF generation
      const content = document.createElement('div');
      content.style.padding = '20px';
      content.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">Student Details</h2>
        ${student.studentPic ? `<img src="${student.studentPic}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;" />` : ''}
        <h3 style="font-size: 20px; margin-bottom: 5px;">${student.name}</h3>
        <p>${student.Class} - Section ${student.section}</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div><strong>Roll No:</strong> ${student.rollNo || 'N/A'}</div>
        <div><strong>Name:</strong> ${student.name || 'N/A'}</div>
        <div><strong>Father Name:</strong> ${student.fatherName || 'N/A'}</div>
        <div><strong>Mother Name:</strong> ${student.motherName || 'N/A'}</div>
        <div><strong>Father Occupation:</strong> ${student.fatherOccupation || 'N/A'}</div>
        <div><strong>Gender:</strong> ${student.gender || 'N/A'}</div>
        <div><strong>Joining Date:</strong> ${student.dateOfJoining || 'N/A'}</div>
        <div><strong>Class:</strong> ${student.Class || 'N/A'}</div>
        <div><strong>Section:</strong> ${student.section || 'N/A'}</div>
        <div><strong>Fees:</strong> ${student.Fees || 'N/A'}</div>
        <div><strong>Date of Birth:</strong> ${student.dateOfBirth || 'N/A'}</div>
        <div><strong>Age:</strong> ${student.age || 'N/A'}</div>
        <div><strong>Religion:</strong> ${student.religion || 'N/A'}</div>
        <div><strong>Phone:</strong> ${student.phone || 'N/A'}</div>
        <div><strong>CNIC/B-Form:</strong> ${student.CNIC_No || 'N/A'}</div>
        <div style="grid-column: 1 / -1;"><strong>Present Address:</strong> ${student.presentAddress || 'N/A'}</div>
        <div style="grid-column: 1 / -1;"><strong>Permanent Address:</strong> ${student.permanentAddress || 'N/A'}</div>
      </div>
    `;

      document.body.appendChild(content);

      const canvas = await html2canvas.default(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${student.name}_Details.pdf`);
      document.body.removeChild(content);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError('Failed to download PDF');
    }
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const dataToExport = groupedData().map(student => ({
      'Roll No': student.rollNo,
      'Name': student.name,
      'Father Name': student.fatherName,
      'Mother Name': student.motherName,
      'Father Occupation': student.fatherOccupation,
      'Gender': student.gender,
      'Joining Date': student.dateOfJoining,
      'Class': student.Class,
      'Section': student.section,
      'Fees': student.Fees,
      'Date of Birth': student.dateOfBirth,
      'Age': student.age,
      'Religion': student.religion,
      'Phone': student.phone,
      'CNIC/B-Form': student.CNIC_No,
      'Present Address': student.presentAddress,
      'Permanent Address': student.permanentAddress
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Students_Data.xlsx");
    showSuccess("Data exported to Excel successfully");
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4">
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

            {/* Button Group */}
            <div className="flex items-center gap-2 ">
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

              {/* Filter Button - Hide for teachers */}
              {(userRole !== "Teacher") && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className=" flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md transition-colors"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              )}

              {/* Add Student Button - Hide for teachers */}
              {(userRole !== "Teacher") && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
                >
                  <FaPlus className="mr-2" /> Add Student
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 flex flex-col gap-3 p-4 bg-white shadow-lg rounded-lg z-10">
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
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto h-[calc(100vh-155px)] max-sm:h-[calc(100vh-160px)] scrollbar-hide">
            <table className="min-w-full table-auto bg-white border border-gray-300 ">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-center">
                <tr>
                  {['', 'Roll No', 'Photo', 'Name', 'Father Name', 'Mother Name', 'Father Occupation', 'Gender', 'Joining Date', 'Class', 'Section', 'Fees', 'DOB', 'Age', 'Religion', 'Phone', 'CNIC/B-Form', 'Present Address', 'Permanent Address', 'Actions'].map((title, idx) => (
                    <th key={idx} className="border px-2 py-3 whitespace-nowrap">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedData().length > 0 ? (
                  groupedData().map((student, index) => (
                    <tr
                      key={student._id}
                      className={`text-center text-sm transition ${index % 2 ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50`}
                    >
                      <td className="border px-3 py-1 text-gray-400">{index + 1}</td>
                      <td className="border px-3 py-1">{student.rollNo}</td>
                      <td className="border px-3 py-1">
                        <img src={student.studentPic} alt="Student" className="h-10 w-10 object-cover rounded-full mx-auto" />
                      </td>
                      <td className="border px-3 py-1">{student.name}</td>
                      <td className="border px-3 py-1">{student.fatherName}</td>
                      <td className="border px-3 py-1">{student.motherName}</td>
                      <td className="border px-3 py-1">{student.fatherOccupation}</td>
                      <td className="border px-3 py-1">{student.gender}</td>
                      <td className="border px-3 py-1 truncate w-fit">{student.dateOfJoining}</td>
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
                        {(userRole !== "Teacher") && (
                          <>
                            <button title="Edit" className="text-green-500 hover:text-green-700" onClick={() => handleEdit(student)}><FaEdit /></button>
                            <button title="Delete" className="text-red-500 hover:text-red-700" onClick={() => confirmDelete(student)}><FaTrash /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="20" className="text-center py-8 text-gray-500">
                      No students found. {userRole === "Teacher" && "You may not have any students assigned to your class."}
                    </td>
                  </tr>
                )}
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