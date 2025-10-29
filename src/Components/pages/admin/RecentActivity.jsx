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
      event: "🎉",
      user_login: "🔐", // Additional for consistency
      user_logout: "🚪" // Additional for consistency
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
      event: "bg-pink-100 text-pink-600",
      user_login: "bg-green-100 text-green-600", // Different color for login
      user_logout: "bg-red-100 text-red-600" // Different color for logout
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const formatTime = (timestamp) => {
    // Check if timestamp is a string or Date object
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }
    
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Group activities by date
  const groupActivitiesByDate = () => {
    const grouped = {};
    
    activities.forEach(activity => {
      const date = formatDate(activity.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    
    return grouped;
  };

  const groupedActivities = groupActivitiesByDate();

  // If no activities
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          <span className="text-sm text-gray-500">0 activities</span>
        </div>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔔</div>
          <p className="text-gray-500 text-sm">No activities yet</p>
          <p className="text-gray-400 text-xs mt-1">Activities will appear here</p>
        </div>
        
        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
          View All Activities
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center mb-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="mx-3 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {date}
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            {/* Activities for this date */}
            <div className="space-y-3">
              {dateActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
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
                      <p className="text-xs text-gray-500 mt-1">
                        By: <span className="font-medium">{activity.user}</span>
                      </p>
                    )}
                    
                    {/* Additional metadata */}
                    {activity.metadata && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <span 
                            key={key}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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