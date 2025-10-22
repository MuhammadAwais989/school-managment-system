import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AttendanceCharts = ({ data, detailed = false }) => {
  const [chartType, setChartType] = useState("bar");
  const [dataFilter, setDataFilter] = useState("all");

  const ChartComponent = chartType === "bar" ? BarChart : LineChart;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {detailed ? "Detailed Attendance Analysis" : "Attendance Overview"}
        </h3>
        
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <select 
            value={dataFilter}
            onChange={(e) => setDataFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
>
            <option value="all">All Data</option>
            <option value="students">Students Only</option>
            <option value="teachers">Teachers Only</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['bar', 'line'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-sm rounded-md capitalize ${
                  chartType === type 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data.monthlyAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[85, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            
            {(dataFilter === "all" || dataFilter === "students") && (
              chartType === "bar" ? (
                <Bar 
                  dataKey="students" 
                  name="Students %" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  name="Students %" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              )
            )}
            
            {(dataFilter === "all" || dataFilter === "teachers") && (
              chartType === "bar" ? (
                <Bar 
                  dataKey="teachers" 
                  name="Teachers %" 
                  fill="#06b6d4" 
                  radius={[4, 4, 0, 0]}
                />
              ) : (
                <Line 
                  type="monotone" 
                  dataKey="teachers" 
                  name="Teachers %" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2 }}
                />
              )
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {detailed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">92.7%</div>
            <div className="text-sm text-gray-600">Average Student Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">91.3%</div>
            <div className="text-sm text-gray-600">Average Staff Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+1.2%</div>
            <div className="text-sm text-gray-600">Improvement This Month</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCharts;