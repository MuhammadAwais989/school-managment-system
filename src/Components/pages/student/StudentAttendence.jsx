import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';
import ReportModal from './AttendenceReport';
import { showError, showSuccess } from '../../utils/Toast';
import { FaSearch, FaFilter, FaUserGraduate, FaCalendarCheck } from 'react-icons/fa';

const StudentAttendence = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Attendance Report');
  const [modalData, setModalData] = useState([]);
  const [modalMode, setModalMode] = useState('detail');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchStudents(role);
  }, []);

  const fetchStudents = async (role) => {
    try {
      let url = `${BaseURL}/students/details`;
      let params = {};

      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        if (assignedClass) {
          params.class = assignedClass;
        }
        if (assignedSection) {
          params.section = assignedSection;
        }
      }

      const queryString = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      ).join('&');

      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await axios.get(url);

      if (!res.data || res.data.length === 0) {
        setStudents([]);
        setFilteredStudents([]);
        setLoading(false);
        return;
      }

      const formatted = res.data.map((s) => ({
        studentId: s._id,
        rollNo: s.rollNo || "N/A",
        profilePic: s.studentPic || "",
        name: s.name,
        fathername: s.fatherName,
        class: s.Class,
        section: s.section,
        status: "present",
      }));

      setStudents(formatted);
      setFilteredStudents(formatted);

      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        if (assignedClass) setClassFilter(assignedClass);
        if (assignedSection) setSectionFilter(assignedSection);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      showError("Failed to fetch students");
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(lowerSearch) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter((s) => s.class === classFilter);
    }

    // Apply section filter - FIXED: Added trim() to handle whitespace issues
    if (sectionFilter) {
      filtered = filtered.filter((s) =>
        s.section && s.section.trim() === sectionFilter.trim()
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, students, classFilter, sectionFilter]);

  const handleStatusChange = (index, value) => {
    const updated = [...filteredStudents];
    updated[index].status = value;
    setFilteredStudents(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date: today,
        records: filteredStudents.map(({ studentId, status, class: cls, section }) => ({
          studentId,
          status,
          class: cls,
          section
        }))
      };

      await axios.post(`${BaseURL}/students/attendence`, payload);
      showSuccess("Attendance marked successfully");
    } catch (err) {
      console.error("Attendance submit error:", err);
      showError("Error marking attendance");
    } finally {
      setShowConfirmPopup(false);
    }
  };

  const handleReportSelect = async (studentId, reportType) => {
    try {
      const response = await axios.get(`${BaseURL}/students/attendence?studentId=${studentId}&type=${reportType}`);
      setModalTitle(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`);
      setModalData([response.data]);
      setModalMode("detail");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching report:", err);
      showError("Failed to fetch report.");
    }
  };

  const handleClassReport = async (type) => {
    try {
      let params = { type: type };
      let title = '';

      // For Teachers, use their assigned class/section
      if (userRole === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        if (assignedClass) params.class = assignedClass;
        if (assignedSection) params.section = assignedSection;

        title = `${assignedClass}${assignedSection ? `-${assignedSection}` : ''} - ${type} Report`;
      }
      // For Admin/Principal, use filters if selected
      else {
        if (classFilter) {
          params.class = classFilter;
          if (sectionFilter) params.section = sectionFilter;
          title = `${classFilter}${sectionFilter ? `-${sectionFilter}` : ''} - ${type} Report`;
        } else {
          // If no class filter selected, show error
          showError("Please select a class to generate the report");
          return;
        }
      }

      const response = await axios.get(`${BaseURL}/students/class/report`, { params });

      setModalTitle(title);
      setModalData(response.data);
      setModalMode("summary");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching class report:", err);
      showError("Failed to fetch class report.");
    }
  };

  // Get unique classes and sections for filters
  const uniqueClasses = [...new Set(students.map(student => student.class))].sort();
  const uniqueSections = [...new Set(students.map(student => student.section))].sort();

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setSectionFilter('');
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full min-h-screen shadow-md rounded-md px-4 max-sm:px-4 overflow-hidden">
          {/* Header Section */}
          <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-md mb-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <FaCalendarCheck className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Student Attendance</h1>
                  <p className="text-sm text-gray-600">
                    {userRole === "Teacher" ? (
                      <>Class: {localStorage.getItem("classAssigned") || "N/A"}, Section: {localStorage.getItem("classSection") || "N/A"}</>
                    ) : (
                      "Manage student attendance records"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FaFilter className="text-gray-500" />
                  Filters
                </button>

                <select
                  onChange={(e) => handleClassReport(e.target.value)}
                  className="border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Reports</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="previous">Previous Month</option>
                  <option value="yearly">Yearly Report</option>
                </select>

                <button
                  onClick={() => setShowConfirmPopup(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  disabled={filteredStudents.length === 0}
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students by name or roll number"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="text-sm text-gray-500">
                Showing {filteredStudents.length} of {
                  userRole === "Teacher"
                    ? students.filter(s =>
                      s.class === localStorage.getItem("classAssigned") &&
                      s.section === localStorage.getItem("classSection")
                    ).length
                    : students.length
                } students
              </div>
            </div>

            {/* Filters - Collapsible */}
            <div className={`mt-4 bg-gray-50 p-4 rounded-lg ${showFilters ? 'block' : 'hidden'}`}>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                    disabled={userRole === "Teacher"}
                  >
                    <option value="">All Classes</option>
                    {uniqueClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                    disabled={userRole === "Teacher"}
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {(searchTerm || classFilter || sectionFilter) && (
                  <button
                    onClick={clearFilters}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Students Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
              <FaUserGraduate className="text-6xl mb-4 opacity-50" />
              <p className="text-lg font-medium">No students found</p>
              <p className="text-sm mt-2">
                {searchTerm || classFilter || sectionFilter
                  ? "Try adjusting your search or filters"
                  : "No students available for attendance"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((s, index) => (
                    <tr key={s.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={s.profilePic}
                              alt="student"
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{s.name}</div>
                            <div className="text-sm text-gray-500">{s.fathername}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{s.rollNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-600 ${s.status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : s.status === 'leave'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          value={s.status}
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          onChange={(e) => handleReportSelect(s.studentId, e.target.value)}
                          className="block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          defaultValue=""
                        >
                          <option value="" disabled>View Report</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="previous">Previous Month</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        data={modalData}
        mode={modalMode}
      />

      {/* Confirm Submit Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M12 3.75c-4.556 0-8.25 3.694-8.25 8.25s3.694 8.25 8.25 8.25 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                Confirm Attendance Submission
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to submit attendance for {filteredStudents.length} students?
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
              >
                Submit
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentAttendence;