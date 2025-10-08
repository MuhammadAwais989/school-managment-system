import React from "react";
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
  const stats = [
    {
      title: "Total Students",
      value: data.students.total.toLocaleString(),
      change: data.students.change,
      trend: data.students.trend,
      secondary: `${data.students.newToday} new today`,
      icon: FaUsers,
      color: "purple",
      link: "/students"
    },
    {
      title: "Teaching Staff",
      value: data.teachers.total.toLocaleString(),
      change: data.teachers.change,
      trend: data.teachers.trend,
      secondary: `${data.teachers.presentToday} present`,
      icon: FaChalkboardTeacher,
      color: "blue",
      link: "/staff/teachers"
    },
    {
      title: "Total Staff",
      value: data.staff.total.toLocaleString(),
      change: data.staff.change,
      trend: data.staff.trend,
      secondary: `${data.staff.presentToday} present`,
      icon: FaUserTie,
      color: "green",
      link: "/staff/support"
    },
    {
      title: "Student Attendance",
      value: `${data.attendance.students.rate}%`,
      change: data.attendance.students.change,
      trend: "up",
      secondary: `${data.attendance.students.present} present`,
      icon: FaChartLine,
      color: "emerald",
      link: "/attendance/students"
    },
    {
      title: "Staff Attendance",
      value: `${data.attendance.staff.rate}%`,
      change: data.attendance.staff.change,
      trend: "up",
      secondary: `${data.attendance.staff.present} present`,
      icon: FaCheckCircle,
      color: "orange",
      link: "/attendance/staff"
    },
    {
      title: "Fee Collection",
      value: `₹${(data.fees.collectedThisMonth / 1000).toFixed(0)}K`,
      change: `${data.fees.achievement}% of target`,
      trend: "up",
      secondary: `₹${(data.fees.dueThisWeek / 1000).toFixed(0)}K due this week`,
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