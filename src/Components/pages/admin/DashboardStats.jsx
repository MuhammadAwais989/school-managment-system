import React, { useState, useEffect } from "react";
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaUserTie, 
  FaChartLine, 
  FaCheckCircle, 
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

const StatsOverview = ({ data }) => {
  const [localStorageData, setLocalStorageData] = useState({
    teacherPresentCount: 0,
    totalPresentStaffCount: 0,
    studentPresentCount: 0 // ✅ ADDED: Student present count
  });

  // ✅ Load data from localStorage
  useEffect(() => {
    const teacherPresentCount = parseInt(localStorage.getItem("teacherPresentCount")) || 0;
    const totalPresentStaffCount = parseInt(localStorage.getItem("totalPresentStaffCount")) || 0;
    const studentPresentCount = parseInt(localStorage.getItem("studentPresentCount")) || 0; // ✅ ADDED
    
    console.log("📊 Dashboard - localStorage data loaded:", {
      teacherPresentCount,
      totalPresentStaffCount,
      studentPresentCount // ✅ ADDED
    });

    setLocalStorageData({
      teacherPresentCount,
      totalPresentStaffCount,
      studentPresentCount // ✅ ADDED
    });
  }, [data]);

  // ✅ Calculate attendance percentage
  const calculateAttendancePercentage = (present, total) => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  // ✅ Calculate staff attendance percentage
  const staffAttendancePercentage = calculateAttendancePercentage(
    localStorageData.totalPresentStaffCount, 
    data.staff.total
  );

  // ✅ Calculate teacher attendance percentage  
  const teacherAttendancePercentage = calculateAttendancePercentage(
    localStorageData.teacherPresentCount,
    data.teachers.total
  );

  // ✅ ADDED: Calculate student attendance percentage
  const studentAttendancePercentage = calculateAttendancePercentage(
    localStorageData.studentPresentCount,
    data.students.total
  );

  const stats = [
    {
      title: "Total Students",
      value: data.students.total.toLocaleString(),
      change: data.students.change,
      trend: data.students.trend,
      // ✅ CHANGED: Use localStorage data for student present count
      secondary: `${localStorageData.studentPresentCount} present today`,
      icon: FaUsers,
      color: "purple",
      link: "/students"
    },
    {
      title: "Teaching Staff",
      value: data.teachers.total.toLocaleString(),
      // ✅ CHANGED: Calculate trend based on present vs total
      change: `${teacherAttendancePercentage}%`,
      trend: teacherAttendancePercentage >= 80 ? "up" : "down",
      secondary: `${localStorageData.teacherPresentCount} present`,
      icon: FaChalkboardTeacher,
      color: "blue",
      link: "/staff/teachers"
    },
    {
      title: "Total Staff",
      value: data.staff.total.toLocaleString(),
      // ✅ CHANGED: Calculate trend based on present vs total
      change: `${staffAttendancePercentage}%`,
      trend: staffAttendancePercentage >= 80 ? "up" : "down",
      secondary: `${localStorageData.totalPresentStaffCount} present`,
      icon: FaUserTie,
      color: "green",
      link: "/staff/support"
    },
    {
      title: "Student Attendance",
      // ✅ CHANGED: Calculate percentage based on localStorage data
      value: `${studentAttendancePercentage}%`,
      // ✅ CHANGED: Show actual present count
      change: `${localStorageData.studentPresentCount}/${data.students.total}`,
      trend: studentAttendancePercentage >= 80 ? "up" : "down",
      // ✅ CHANGED: Show detailed information
      secondary: `${localStorageData.studentPresentCount} present out of ${data.students.total}`,
      icon: FaChartLine,
      color: "emerald",
      link: "/attendance/students"
    },
    {
      title: "Staff Attendance",
      // ✅ CHANGED: Calculate percentage based on localStorage data
      value: `${staffAttendancePercentage}%`,
      // ✅ CHANGED: Show actual present count
      change: `${localStorageData.totalPresentStaffCount}/${data.staff.total}`,
      trend: staffAttendancePercentage >= 80 ? "up" : "down",
      secondary: `${localStorageData.totalPresentStaffCount} present out of ${data.staff.total}`,
      icon: FaCheckCircle,
      color: "orange",
      link: "/attendance/staff"
    },
    {
      title: "Fee Collection",
      value: `₹${(data.fees.currentMonthCollection / 1000).toFixed(0)}K`,
      change: `₹${(data.fees.currentMonthDues / 1000).toFixed(0)}K dues`,
      trend: "up",
      secondary: `${data.currentMonthFees?.currentMonth || new Date().toLocaleString('default', { month: 'long' })}`,
      icon: FaMoneyBillWave,
      color: "indigo",
      link: "/fees"
    }
  ];

  const getColorClasses = (color, type = "bg") => {
    const colors = {
      purple: {
        bg: "bg-purple-500/10 backdrop-blur-lg border border-purple-200/20",
        text: "text-purple-700",
        icon: "text-purple-600 bg-purple-500/20",
        trend: "text-purple-600 bg-purple-500/20",
        glow: "shadow-purple-500/25"
      },
      blue: {
        bg: "bg-blue-500/10 backdrop-blur-lg border border-blue-200/20",
        text: "text-blue-700",
        icon: "text-blue-600 bg-blue-500/20",
        trend: "text-blue-600 bg-blue-500/20",
        glow: "shadow-blue-500/25"
      },
      green: {
        bg: "bg-green-500/10 backdrop-blur-lg border border-green-200/20",
        text: "text-green-700",
        icon: "text-green-600 bg-green-500/20",
        trend: "text-green-600 bg-green-500/20",
        glow: "shadow-green-500/25"
      },
      emerald: {
        bg: "bg-emerald-500/10 backdrop-blur-lg border border-emerald-200/20",
        text: "text-emerald-700",
        icon: "text-emerald-600 bg-emerald-500/20",
        trend: "text-emerald-600 bg-emerald-500/20",
        glow: "shadow-emerald-500/25"
      },
      orange: {
        bg: "bg-orange-500/10 backdrop-blur-lg border border-orange-200/20",
        text: "text-orange-700",
        icon: "text-orange-600 bg-orange-500/20",
        trend: "text-orange-600 bg-orange-500/20",
        glow: "shadow-orange-500/25"
      },
      indigo: {
        bg: "bg-indigo-500/10 backdrop-blur-lg border border-indigo-200/20",
        text: "text-indigo-700",
        icon: "text-indigo-600 bg-indigo-500/20",
        trend: "text-indigo-600 bg-indigo-500/20",
        glow: "shadow-indigo-500/25"
      }
    };
    return colors[color]?.[type] || colors.purple[type];
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />;
  };

  // ✅ Updated Debug log
  console.log("📊 Dashboard Stats - Calculated Data:", {
    studentPresent: localStorageData.studentPresentCount,
    studentTotal: data.students.total,
    studentPercentage: studentAttendancePercentage,
    teacherPresent: localStorageData.teacherPresentCount,
    teacherTotal: data.teachers.total,
    teacherPercentage: teacherAttendancePercentage,
    staffPresent: localStorageData.totalPresentStaffCount,
    staffTotal: data.staff.total,
    staffPercentage: staffAttendancePercentage
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${getColorClasses(stat.color, "bg")} rounded-3xl p-6 transition-all duration-500 cursor-pointer group hover:shadow-2xl ${getColorClasses(stat.color, "glow")} hover:scale-105`}
          onClick={() => window.location.href = stat.link}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-2xl backdrop-blur-sm ${getColorClasses(stat.color, "icon")}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${getColorClasses(stat.color, "trend")}`}>
                {getTrendIcon(stat.trend)}
                <span>{stat.change}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-base font-semibold text-gray-700">
                {stat.title}
              </p>
              <p className="text-sm text-gray-600">
                {stat.secondary}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;