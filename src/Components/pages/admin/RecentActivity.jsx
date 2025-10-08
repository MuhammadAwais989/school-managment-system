import React from "react";

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      admission: "👨‍🎓",
      fee_payment: "💰",
      attendance: "📝",
      notice: "📢",
      login: "🔐",
      logout: "🚪",
      exam: "📝",
      event: "🎉"
    };
    return icons[type] || "🔔";
  };

  const getActivityColor = (type) => {
    const colors = {
      admission: "bg-purple-100 text-purple-600",
      fee_payment: "bg-green-100 text-green-600",
      attendance: "bg-blue-100 text-blue-600",
      notice: "bg-orange-100 text-orange-600",
      login: "bg-gray-100 text-gray-600",
      logout: "bg-gray-100 text-gray-600",
      exam: "bg-red-100 text-red-600",
      event: "bg-pink-100 text-pink-600"
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              {activity.amount && (
                <p className="text-xs font-medium text-green-600 mt-1">
                  ₹{activity.amount.toLocaleString()}
                </p>
              )}
              {activity.user && (
                <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
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