import React, { useState } from "react";

const CalendarWidget = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getEventColor = (type) => {
    const colors = {
      event: "bg-blue-100 text-blue-800 border-blue-200",
      meeting: "bg-green-100 text-green-800 border-green-200",
      exam: "bg-red-100 text-red-800 border-red-200",
      holiday: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getDayDifference = (date) => {
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
      
      {upcomingEvents.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📅</div>
          <p className="text-gray-500 text-sm">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border ${getEventColor(event.type)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  <p className="text-xs opacity-75 mt-1">{getDayDifference(event.date)}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatDate(event.date)}</div>
                  <div className="text-xs opacity-75 capitalize">{event.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
        View Full Calendar
      </button>
    </div>
  );
};

export default CalendarWidget;