import React from "react";

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      fee_payment: "💰",
      attendance: "📝",
      new_admission: "👨‍🎓",
      teacher_attendance: "👨‍🏫",
      expense: "💸"
    };
    return icons[type] || "🔔";
  };

  const getActivityColor = (type) => {
    const colors = {
      fee_payment: "text-green-600 bg-green-50",
      attendance: "text-blue-600 bg-blue-50",
      new_admission: "text-purple-600 bg-purple-50",
      teacher_attendance: "text-orange-600 bg-orange-50",
      expense: "text-red-600 bg-red-50"
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              {activity.amount && (
                <p className="text-xs font-medium text-green-600 mt-1">
                  ₹{activity.amount.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivities;