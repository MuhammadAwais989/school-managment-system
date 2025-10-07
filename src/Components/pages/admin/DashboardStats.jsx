import React from "react";

const StatsOverview = ({ data }) => {
  const stats = [
    {
      title: "Total Students",
      value: data.students.total.toLocaleString(),
      change: data.students.change,
      trend: data.students.trend,
      secondary: `${data.students.newToday} new today`,
      icon: "👨‍🎓",
      color: "purple",
      link: "/students"
    },
    {
      title: "Teaching Staff",
      value: data.teachers.total.toLocaleString(),
      change: data.teachers.change,
      trend: data.teachers.trend,
      secondary: `${data.teachers.presentToday} present`,
      icon: "👨‍🏫",
      color: "blue",
      link: "/staff/teachers"
    },
    {
      title: "Support Staff",
      value: data.staff.total.toLocaleString(),
      change: data.staff.change,
      trend: data.staff.trend,
      secondary: `${data.staff.presentToday} present`,
      icon: "💼",
      color: "green",
      link: "/staff/support"
    },
    {
      title: "Student Attendance",
      value: `${data.attendance.students.rate}%`,
      change: data.attendance.students.change,
      trend: "up",
      secondary: `${data.attendance.students.present} present`,
      icon: "📊",
      color: "emerald",
      link: "/attendance/students"
    },
    {
      title: "Staff Attendance",
      value: `${data.attendance.staff.rate}%`,
      change: data.attendance.staff.change,
      trend: "up",
      secondary: `${data.attendance.staff.present} present`,
      icon: "✅",
      color: "orange",
      link: "/attendance/staff"
    },
    {
      title: "Fee Collection",
      value: `₹${(data.fees.collectedThisMonth / 1000).toFixed(0)}K`,
      change: `${data.fees.achievement}% of target`,
      trend: "up",
      secondary: `₹${(data.fees.dueThisWeek / 1000).toFixed(0)}K due this week`,
      icon: "💰",
      color: "indigo",
      link: "/fees"
    }
  ];

  const getColorClasses = (color, type = "bg") => {
    const colors = {
      purple: {
        bg: "bg-purple-50 border-purple-200",
        text: "text-purple-600",
        icon: "bg-purple-100 text-purple-600"
      },
      blue: {
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-600",
        icon: "bg-blue-100 text-blue-600"
      },
      green: {
        bg: "bg-green-50 border-green-200",
        text: "text-green-600",
        icon: "bg-green-100 text-green-600"
      },
      emerald: {
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-600",
        icon: "bg-emerald-100 text-emerald-600"
      },
      orange: {
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-600",
        icon: "bg-orange-100 text-orange-600"
      },
      indigo: {
        bg: "bg-indigo-50 border-indigo-200",
        text: "text-indigo-600",
        icon: "bg-indigo-100 text-indigo-600"
      }
    };
    return colors[color]?.[type] || colors.purple[type];
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? "↗" : "↘";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${getColorClasses(stat.color)} rounded-xl border p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
          onClick={() => window.location.href = stat.link}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat.color, "icon")}`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {getTrendIcon(stat.trend)} {stat.change}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700">
              {stat.value}
            </h3>
            <p className="text-sm font-medium text-gray-600 mt-1">
              {stat.title}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {stat.secondary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;