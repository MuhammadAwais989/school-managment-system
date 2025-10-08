import React, { useState, useEffect } from "react";
import { 
  FaUserSlash, 
  FaCalendarTimes, 
  FaPhone, 
  FaSearch,
  FaFilter,
  FaDownload
} from "react-icons/fa";

const StudentAttendanceTable = () => {
  const [absentStudents, setAbsentStudents] = useState([]);
  const [leaveStudents, setLeaveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  // Sample data - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockAbsentStudents = [
        {
          id: 1,
          rollNo: "101",
          name: "Rahul Sharma",
          class: "10-A",
          section: "A",
          contactNo: "9876543210",
          reason: "Sick",
          parentName: "Mr. Sharma"
        },
        {
          id: 2,
          rollNo: "102",
          name: "Priya Singh",
          class: "10-A",
          section: "A",
          contactNo: "9876543211",
          reason: "Family function",
          parentName: "Mrs. Singh"
        },
        {
          id: 3,
          rollNo: "205",
          name: "Amit Kumar",
          class: "9-B",
          section: "B",
          contactNo: "9876543212",
          reason: "Doctor appointment",
          parentName: "Mr. Kumar"
        },
        {
          id: 4,
          rollNo: "308",
          name: "Sneha Patel",
          class: "11-C",
          section: "C",
          contactNo: "9876543213",
          reason: "Personal work",
          parentName: "Mr. Patel"
        }
      ];

      const mockLeaveStudents = [
        {
          id: 1,
          rollNo: "105",
          name: "Karan Mehta",
          class: "10-A",
          section: "A",
          contactNo: "9876543214",
          leaveType: "Medical",
          leaveDays: 3,
          fromDate: "2024-01-15",
          toDate: "2024-01-17",
          status: "Approved"
        },
        {
          id: 2,
          rollNo: "209",
          name: "Neha Gupta",
          class: "9-B",
          section: "B",
          contactNo: "9876543215",
          leaveType: "Personal",
          leaveDays: 2,
          fromDate: "2024-01-16",
          toDate: "2024-01-17",
          status: "Pending"
        },
        {
          id: 3,
          rollNo: "312",
          name: "Rohit Verma",
          class: "11-C",
          section: "C",
          contactNo: "9876543216",
          leaveType: "Emergency",
          leaveDays: 1,
          fromDate: "2024-01-15",
          toDate: "2024-01-15",
          status: "Approved"
        }
      ];

      setAbsentStudents(mockAbsentStudents);
      setLeaveStudents(mockLeaveStudents);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter students based on search and class
  const filteredAbsentStudents = absentStudents.filter(student =>
    (selectedClass === "all" || student.class === selectedClass) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.rollNo.includes(searchTerm))
  );

  const filteredLeaveStudents = leaveStudents.filter(student =>
    (selectedClass === "all" || student.class === selectedClass) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.rollNo.includes(searchTerm))
  );

  const classes = ["all", "10-A", "10-B", "9-A", "9-B", "11-A", "11-B", "12-A", "12-B"];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Student Status</h2>
            <p className="text-gray-600 mt-1">Absent students and leave applications for today</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.filter(cls => cls !== "all").map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Absent Students Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaUserSlash className="text-red-500 w-5 h-5" />
                Today's Absent Students
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                  {filteredAbsentStudents.length}
                </span>
              </h3>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAbsentStudents.length > 0 ? (
                    filteredAbsentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNo}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.class}</div>
                          <div className="text-sm text-gray-500">Sec: {student.section}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            {student.contactNo}
                          </div>
                          <div className="text-xs text-gray-500">{student.parentName}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            {student.reason}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        <FaUserSlash className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No absent students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Students Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaCalendarTimes className="text-orange-500 w-5 h-5" />
                Today's Leave Applications
                <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                  {filteredLeaveStudents.length}
                </span>
              </h3>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaveStudents.length > 0 ? (
                    filteredLeaveStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNo}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.class}</div>
                          <div className="text-sm text-gray-500">Sec: {student.section}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            {student.contactNo}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                student.leaveType === 'Medical' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : student.leaveType === 'Personal'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {student.leaveType}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                student.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.fromDate} to {student.toDate} ({student.leaveDays} days)
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        <FaCalendarTimes className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No leave applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Total Absent</p>
                <p className="text-2xl font-bold text-red-900">{absentStudents.length}</p>
              </div>
              <FaUserSlash className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Total Leaves</p>
                <p className="text-2xl font-bold text-orange-900">{leaveStudents.length}</p>
              </div>
              <FaCalendarTimes className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-900">94.2%</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600">+2.1% from yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceTable;