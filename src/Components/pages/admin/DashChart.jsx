import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const DashboardCharts = ({ data }) => {
  // Sample data for charts
  const attendanceData = [
    { name: 'Mon', students: 92, teachers: 94 },
    { name: 'Tue', students: 95, teachers: 96 },
    { name: 'Wed', students: 93, teachers: 92 },
    { name: 'Thu', students: 91, teachers: 95 },
    { name: 'Fri', students: 94, teachers: 93 },
    { name: 'Sat', students: 88, teachers: 90 }
  ];

  const financeData = [
    { name: 'Jan', income: 420, expense: 280 },
    { name: 'Feb', income: 380, expense: 320 },
    { name: 'Mar', income: 450, expense: 290 },
    { name: 'Apr', income: 410, expense: 310 },
    { name: 'May', income: 480, expense: 330 },
    { name: 'Jun', income: 520, expense: 350 }
  ];

  const studentDistribution = [
    { name: 'Class 1-5', value: 400 },
    { name: 'Class 6-8', value: 350 },
    { name: 'Class 9-10', value: 300 },
    { name: 'Class 11-12', value: 197 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Attendance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Attendance Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Students %" />
              <Line type="monotone" dataKey="teachers" stroke="#10B981" strokeWidth={2} name="Teachers %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Finance and Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Finance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expense (in '000s)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;