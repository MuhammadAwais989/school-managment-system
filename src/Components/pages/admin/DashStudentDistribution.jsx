import React, { useState, useEffect } from "react";
import {
  FaUserSlash,
  FaCalendarTimes,
  FaPhone,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import jsPDF from "jspdf";

const DashStudentDistribution = () => {
  const [absentStudents, setAbsentStudents] = useState([]);
  const [leaveStudents, setLeaveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  // ✅ Load today's absent and leave students from localStorage
  useEffect(() => {
    const loadTodayStudents = () => {
      try {
        setLoading(true);

        const today = new Date().toISOString().split("T")[0];
        const lastUpdate = localStorage.getItem("lastAttendanceUpdate");

        // Check if data is from today
        if (lastUpdate && !lastUpdate.startsWith(today)) {
          console.log("🔄 Today's data is old, showing empty");
          setAbsentStudents([]);
          setLeaveStudents([]);
          setLoading(false);
          return;
        }

        const absent = JSON.parse(
          localStorage.getItem("todayAbsentStudents") || "[]"
        );
        const leave = JSON.parse(
          localStorage.getItem("todayLeaveStudents") || "[]"
        );

        console.log("📊 Today's Students Loaded:", {
          absent: absent,
          leave: leave,
        });

        setAbsentStudents(absent);
        setLeaveStudents(leave);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error loading today's students:", error);
        setAbsentStudents([]);
        setLeaveStudents([]);
        setLoading(false);
      }
    };

    loadTodayStudents();
  }, []);

  // Filter students based on search and class
  const filteredAbsentStudents = absentStudents.filter(
    (student) =>
      (selectedClass === "all" || student.class === selectedClass) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.fathername.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLeaveStudents = leaveStudents.filter(
    (student) =>
      (selectedClass === "all" || student.class === selectedClass) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm) ||
        student.fathername.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get unique classes from data
  const classes = [
    "all",
    ...new Set(
      [
        ...absentStudents.map((student) => student.class),
        ...leaveStudents.map((student) => student.class),
      ].filter(Boolean)
    ),
  ];

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let startY = 20;

    // Title
    doc.setFontSize(16);
    doc.text("Today's Student Attendance Report", pageWidth / 2, 15, {
      align: "center",
    });

    // Date
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Date: ${today}`, 14, 25);

    // Absent Students Section
    startY = 35;
    doc.setFontSize(12);
    doc.text("Absent Students", 14, startY);
    startY += 10;

    if (filteredAbsentStudents.length > 0) {
      const absentHeaders = [
        "Roll No",
        "Name",
        "Father Name",
        "Class",
        "Section",
      ];
      doc.setFontSize(8);
      absentHeaders.forEach((header, index) => {
        doc.text(header, 14 + index * 30, startY);
      });
      startY += 6;

      filteredAbsentStudents.forEach((student) => {
        const row = [
          student.rollNo,
          student.name,
          student.fathername,
          student.class,
          student.section,
          // student.phone // ✅ FIXED: Use phone field
        ];

        row.forEach((item, idx) => {
          doc.text(String(item), 14 + idx * 30, startY);
        });

        startY += 6;
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      });
    } else {
      doc.text("No absent students today", 14, startY);
      startY += 10;
    }

    // Leave Students Section
    startY += 10;
    doc.setFontSize(12);
    doc.text("Leave Students", 14, startY);
    startY += 10;

    if (filteredLeaveStudents.length > 0) {
      const leaveHeaders = [
        "Roll No",
        "Name",
        "Father Name",
        "Class",
        "Section",
      ];
      doc.setFontSize(8);
      leaveHeaders.forEach((header, index) => {
        doc.text(header, 14 + index * 25, startY);
      });
      startY += 6;

      filteredLeaveStudents.forEach((student) => {
        const row = [
          student.rollNo,
          student.name,
          student.fathername,
          student.class,
          student.section,
          // student.phone, // ✅ FIXED: Use phone field
          // student.leaveType
        ];

        console.log("Student data for PDF:", student); // Debug log

        row.forEach((item, idx) => {
          doc.text(String(item), 14 + idx * 25, startY);
        });

        startY += 6;
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      });
    } else {
      doc.text("No leave students today", 14, startY);
    }

    // Summary
    startY += 15;
    doc.setFontSize(10);
    doc.text(`Total Absent: ${absentStudents.length}`, 14, startY);
    doc.text(`Total Leave: ${leaveStudents.length}`, 80, startY);
    doc.text(
      `Total Students: ${absentStudents.length + leaveStudents.length}`,
      140,
      startY
    );

    doc.save(
      `today_attendance_report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

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
            <h2 className="text-2xl font-bold text-gray-900">
              Today's Student Status
            </h2>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, roll no, father name..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
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
              {classes
                .filter((cls) => cls !== "all")
                .map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={
                absentStudents.length === 0 && leaveStudents.length === 0
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                absentStudents.length === 0 && leaveStudents.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaDownload className="w-4 h-4" />
              Export PDF
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
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAbsentStudents.length > 0 ? (
                    filteredAbsentStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm font-medium text-gray-900">
                            Father: {student.fathername}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.class}
                          </div>
                          <div className="text-sm text-gray-500">
                            Sec: {student.section}
                          </div>
                        </td>
                        {/* <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FaPhone className="w-3 h-3 text-gray-400" />
                            {student.phone} 
                          </div>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <FaUserSlash className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No absent students today
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
                Today's Leave Students
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
                      Roll No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Father Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact & Leave Type
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaveStudents.length > 0 ? (
                    filteredLeaveStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNo}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </div>
                        </td>
                          <td>
                            <div className="text-sm font-medium text-gray-900">
                              {student.fathername}
                            </div>
                          </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.class}
                          </div>
                          <div className="text-sm text-gray-500">
                            Sec: {student.section}
                          </div>
                        </td>
                        {/* <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-900 mb-1">
                            <FaPhone className="w-3 h-3 text-black" />
                            {student.phone} 
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {student.leaveType}
                          </span>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <FaCalendarTimes className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No leave students today
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
                <p className="text-sm font-medium text-red-800">
                  Total Absent Today
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {absentStudents.length}
                </p>
              </div>
              <FaUserSlash className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Total Leave Today
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {leaveStudents.length}
                </p>
              </div>
              <FaCalendarTimes className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Today</p>
                <p className="text-2xl font-bold text-blue-900">
                  {absentStudents.length + leaveStudents.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600">Absent + Leave</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashStudentDistribution;
