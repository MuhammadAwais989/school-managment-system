import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';
import ReportModal from '../student/AttendenceReport';
import { showError, showSuccess } from '../../utils/Toast';
import { FaSearch, FaFilter, FaChalkboardTeacher, FaCalendarCheck, FaCalendarAlt, FaUserTie, FaUserShield, FaUserCog, FaUser, FaShieldAlt, FaDoorOpen, FaTimes, FaSpinner } from 'react-icons/fa';

const TeacherAttendence = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Attendance Report');
  const [modalData, setModalData] = useState([]);
  const [modalMode, setModalMode] = useState('detail');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // For filters
  const [designationFilter, setDesignationFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  
  // For custom date selection in reports
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [showDateSelector, setShowDateSelector] = useState(false);
  
  // For custom report modal
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [customReportType, setCustomReportType] = useState('monthly');
  const [customYear, setCustomYear] = useState(new Date().getFullYear());
  const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);

  // Allowed designations
  const allowedDesignations = [
    'Principle', 'Admin', 'Teacher', 'Incharge', 'Sub Incharge', 'Sweeper', 'Gatekeeper'
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseURL}/addaccount`);

      if (!res.data || res.data.length === 0) {
        setTeachers([]);
        setFilteredTeachers([]);
        setLoading(false);
        return;
      }

      // Filter for all allowed designations and format the data
      const teacherData = res.data
        .filter(item => allowedDesignations.includes(item.designation))
        .map((t) => ({
          teacherId: t._id,
          class: t.Class || "N/A",
          profilePic: t.profilePic || "",
          name: t.name,
          email: t.email,
          section: t.section || "General",
          designation: t.designation,
          status: "present",
        }));

      setTeachers(teacherData);
      setFilteredTeachers(teacherData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      showError("Failed to fetch staff members");
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = teachers;
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((t) => 
        t.name.toLowerCase().includes(lowerSearch) ||
        (t.class && t.class.toLowerCase().includes(lowerSearch)) ||
        (t.email && t.email.toLowerCase().includes(lowerSearch)) ||
        (t.section && t.section.toLowerCase().includes(lowerSearch)) ||
        (t.designation && t.designation.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Apply designation filter
    if (designationFilter && designationFilter !== 'all') {
      filtered = filtered.filter((t) => t.designation === designationFilter);
    }
    
    // Apply section filter
    if (sectionFilter && sectionFilter !== 'all') {
      filtered = filtered.filter((t) => t.section === sectionFilter);
    }
    
    // Apply class filter
    if (classFilter && classFilter !== 'all') {
      filtered = filtered.filter((t) => t.class === classFilter);
    }
    
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers, designationFilter, sectionFilter, classFilter]);

  const handleStatusChange = (index, value) => {
    const updated = [...filteredTeachers];
    updated[index].status = value;
    setFilteredTeachers(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const payload = {
      date: today,
      records: filteredTeachers.map(({ teacherId, status }) => ({
        teacherId,
        status,
      })),
    };

    console.log("Submitting attendance payload:", payload);

    try {
      const res = await axios.post(`${BaseURL}/teachers/attendence`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      showSuccess(res.data.message || "Attendance submitted successfully!");
      setShowConfirmPopup(false);
    } catch (err) {
      console.error("Attendance submit error:", err.response?.data || err.message);
      showError(err.response?.data?.message || "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

// ... (previous imports and component setup)

const handleReportSelect = async (teacherId, reportType, customDate = null) => {
  try {
    let url = `${BaseURL}/teachers/attendence?teacherId=${teacherId}&type=${reportType}`;
    
    if (customDate) {
      url += `&year=${customDate.year}&month=${customDate.month}`;
    }
    
    const response = await axios.get(url);
    const responseData = response.data;
    
    // Handle both single staff and all staff report structures
    let modalData = [];
    let modalMode = "detail";
    
    if (responseData.records) {
      // Single staff detail report
      modalData = [{
        staffId: teacherId,
        name: responseData.staff?.name || '',
        designation: responseData.staff?.designation || '',
        class: responseData.staff?.class || '',
        section: responseData.staff?.section || '',
        records: responseData.records
      }];
      modalMode = "detail";
    } else if (Array.isArray(responseData)) {
      // Direct array response
      modalData = responseData;
      modalMode = responseData[0]?.records ? "detail" : "summary";
    } else if (responseData.reportData) {
      // All staff summary report
      modalData = responseData.reportData;
      modalMode = "summary";
    }
    
    setModalTitle(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`);
    setModalData(modalData);
    setModalMode(modalMode);
    setShowModal(true);
  } catch (err) {
    console.error("Error fetching report:", err);
    showError("Failed to fetch report.");
  }
};

const handleAllTeachersReport = async (type, customDate = null) => {
  try {
    let params = { type: type };
    
    if (customDate) {
      params.year = customDate.year;
      if (customDate.month) params.month = customDate.month;
    }

    const response = await axios.get(`${BaseURL}/teachers/all/report`, { params });
    const responseData = response.data;

    let title = `All Staff - ${type} Report`;
    if (customDate) {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      title = `All Staff - ${monthNames[customDate.month - 1]} ${customDate.year} Report`;
    }

    setModalTitle(title);
    
    // Ensure we're using the reportData array from the response
    setModalData(responseData.reportData || responseData);
    setModalMode("summary");
    setShowModal(true);
  } catch (err) {
    console.error("Error fetching all staff report:", err);
    showError("Failed to fetch staff report.");
  }
};

// ... (rest of the component remains the same)

  const clearFilters = () => {
    setSearchTerm('');
    setDesignationFilter('all');
    setSectionFilter('all');
    setClassFilter('all');
  };

  // Get unique sections, classes, and designations for filter
  const sections = [...new Set(teachers.map(teacher => teacher.section))];
  const classes = [...new Set(teachers.map(teacher => teacher.class))];
  const designations = [...new Set(teachers.map(teacher => teacher.designation))];

  // Generate years for dropdown (last 10 years and next 2 years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  };

  // Generate months for dropdown
  const generateMonths = () => {
    return [
      { value: 1, name: "January" },
      { value: 2, name: "February" },
      { value: 3, name: "March" },
      { value: 4, name: "April" },
      { value: 5, name: "May" },
      { value: 6, name: "June" },
      { value: 7, name: "July" },
      { value: 8, name: "August" },
      { value: 9, name: "September" },
      { value: 10, name: "October" },
      { value: 11, name: "November" },
      { value: 12, name: "December" }
    ];
  };

  const handleCustomReport = (reportType) => {
    if (showDateSelector) {
      // Use the selected year and month for the report
      handleAllTeachersReport(reportType, { year: reportYear, month: reportMonth });
      setShowDateSelector(false);
    } else {
      // For standard reports without date selection
      handleAllTeachersReport(reportType);
    }
  };

  // Get icon based on designation
  const getDesignationIcon = (designation) => {
    switch (designation) {
      case 'Principle':
        return <FaUserTie className="text-purple-600" />;
      case 'Admin':
        return <FaUserShield className="text-blue-600" />;
      case 'Teacher':
        return <FaChalkboardTeacher className="text-indigo-600" />;
      case 'Incharge':
        return <FaUserCog className="text-green-600" />;
      case 'Sub Incharge':
        return <FaUserCog className="text-teal-600" />;
      case 'Sweeper':
        return <FaUser className="text-orange-600" />;
      case 'Gatekeeper':
        return <FaDoorOpen className="text-red-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  // Open custom report modal
  const openCustomReportModal = (teacher, reportType) => {
    setSelectedTeacher(teacher);
    setCustomReportType(reportType);
    setCustomYear(new Date().getFullYear());
    setCustomMonth(new Date().getMonth() + 1);
    setShowCustomReportModal(true);
  };

  // Generate custom report
  const generateCustomReport = () => {
    if (selectedTeacher) {
      handleReportSelect(selectedTeacher.teacherId, customReportType, { 
        year: customYear, 
        month: customMonth 
      });
    }
    setShowCustomReportModal(false);
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full min-h-screen shadow-md rounded-md px-4 max-sm:px-4 overflow-hidden">
          {/* Header Section */}
          <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-md mb-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <FaUserTie className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Staff Attendance</h1>
                  <p className="text-sm text-gray-600">Manage staff attendance records</p>
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
                
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setShowDateSelector(true);
                      } else if (e.target.value) {
                        handleAllTeachersReport(e.target.value);
                      }
                    }}
                    className="border cursor-pointer border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Reports</option>
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="previous">Previous Month</option>
                    <option value="yearly">Yearly Report</option>
                    <option value="custom">Custom Report...</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowConfirmPopup(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  disabled={filteredTeachers.length === 0 || submitting}
                >
                  {submitting ? "Submitting..." : "Submit Attendance"}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Selector */}
          {showDateSelector && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">Select Report Period</h3>
                <button 
                  onClick={() => setShowDateSelector(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  × Cancel
                </button>
              </div>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={reportYear}
                    onChange={(e) => setReportYear(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {generateYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={reportMonth}
                    onChange={(e) => setReportMonth(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {generateMonths().map(month => (
                      <option key={month.value} value={month.value}>{month.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAllTeachersReport("monthly", { year: reportYear, month: reportMonth })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Generate Monthly Report
                  </button>
                  <button
                    onClick={() => handleAllTeachersReport("yearly", { year: reportYear })}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    Generate Yearly Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters Section */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search staff by name, designation, class, email or section"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {filteredTeachers.length} of {teachers.length} staff members
              </div>
            </div>

            {/* Filters - Collapsible */}
            <div className={`mt-4 bg-gray-50 p-4 rounded-lg ${showFilters ? 'block' : 'hidden'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Designation Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <select
                    value={designationFilter}
                    onChange={(e) => setDesignationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Designations</option>
                    {designations.map((desig, index) => (
                      <option key={index} value={desig}>{desig}</option>
                    ))}
                  </select>
                </div>

                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((cls, index) => (
                      <option key={index} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* Section Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Sections</option>
                    {sections.map((sec, index) => (
                      <option key={index} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end md:col-span-3">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
              <FaUserTie className="text-6xl mb-4 opacity-50" />
              <p className="text-lg font-medium">No staff members found</p>
              <p className="text-sm mt-2">
                {searchTerm || designationFilter !== 'all' || sectionFilter !== 'all' || classFilter !== 'all'
                  ? "Try adjusting your search or filters" 
                  : "No staff members available for attendance"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((t, index) => (
                    <tr key={t.teacherId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={t.profilePic}
                              alt="staff"
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{t.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getDesignationIcon(t.designation)}</span>
                          <span className="text-sm text-gray-900">{t.designation}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{t.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{t.section}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-sm focus:ring-2 focus:ring-indigo-600 ${
                            t.status === 'absent' 
                              ? 'bg-red-100 text-red-800' 
                              : t.status === 'leave' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                          }`}
                          value={t.status}
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                          disabled={submitting}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value === "custom") {
                                openCustomReportModal(t, "monthly");
                              } else if (e.target.value) {
                                handleReportSelect(t.teacherId, e.target.value);
                              }
                            }}
                            className="block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            defaultValue=""
                            disabled={submitting}
                          >
                            <option value="" disabled>View Report</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="custom">Custom Period...</option>
                          </select>
                        </div>
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

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Custom Report</h2>
              <button
                onClick={() => setShowCustomReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
                disabled={submitting}
              >
                <FaTimes />
              </button>
            </div>
            
            {selectedTeacher && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700">{selectedTeacher.name}</p>
                <p className="text-sm text-gray-500">{selectedTeacher.designation}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={customReportType}
                  onChange={(e) => setCustomReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={submitting}
                >
                  <option value="monthly">Monthly Report</option>
                  <option value="yearly">Yearly Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={customYear}
                  onChange={(e) => setCustomYear(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={submitting}
                >
                  {generateYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {customReportType === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    value={customMonth}
                    onChange={(e) => setCustomMonth(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                  >
                    {generateMonths().map(month => (
                      <option key={month.value} value={month.value}>{month.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCustomReportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={generateCustomReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                disabled={submitting}
              >
                {submitting ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Submit Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 text-center">
            <div className="flex flex-col items-center">
              {submitting ? (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <FaSpinner className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              ) : (
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
              )}
              
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {submitting ? "Submitting Attendance..." : "Confirm Attendance Submission"}
              </h2>
              
              {!submitting && (
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to submit attendance for {filteredTeachers.length} staff members?
                </p>
              )}
            </div>

            {!submitting && (
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
            )}

            {submitting && (
              <div className="mt-6">
                <p className="text-sm text-gray-600">Please wait while we save attendance...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherAttendence;