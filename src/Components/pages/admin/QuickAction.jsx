import React from "react";

const QuickActions = () => {
  const actions = [
    {
      title: "Take Attendance",
      description: "Record today's attendance",
      icon: "📝",
      color: "blue",
      link: "/attendance"
    },
    {
      title: "Collect Fees",
      description: "Process fee payments",
      icon: "💰",
      color: "green",
      link: "/fees/collect"
    },
    {
      title: "Add Student",
      description: "Register new student",
      icon: "👨‍🎓",
      color: "purple",
      link: "/students/add"
    },
    {
      title: "Generate Report",
      description: "Create custom reports",
      icon: "📊",
      color: "orange",
      link: "/reports"
    },
    {
      title: "Send Notice",
      description: "Publish school notice",
      icon: "📢",
      color: "red",
      link: "/notices"
    },
    {
      title: "Manage Staff",
      description: "Staff administration",
      icon: "👨‍🏫",
      color: "indigo",
      link: "/staff"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100",
      green: "bg-green-50 border-green-200 text-green-600 hover:bg-green-100",
      purple: "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100",
      orange: "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100",
      red: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center text-center ${getColorClasses(action.color)}`}
            onClick={() => window.location.href = action.link}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="font-medium text-sm">{action.title}</span>
            <span className="text-xs opacity-75 mt-1">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;