import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FinanceOverview = ({ data }) => {
  const feeStatusData = [
    { name: 'Paid', value: data.overview.fees.collectedThisMonth, color: '#10b981' },
    { name: 'Pending', value: data.overview.fees.totalPending, color: '#f59e0b' },
    { name: 'Overdue', value: data.overview.fees.dueThisWeek, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Fee Collection vs Target */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Fee Collection vs Target</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.charts.feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `₹${(value / 1000).toFixed(0)}K`,
                  name === 'target' ? 'Target Amount' : 'Collected Amount'
                ]}
              />
              <Legend />
              <Bar dataKey="target" name="Target Amount" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected Amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fee Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Fee Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Collected This Month</span>
              <span className="text-green-700 font-bold">₹{(data.overview.fees.collectedThisMonth / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700 font-medium">Total Pending</span>
              <span className="text-yellow-700 font-bold">₹{(data.overview.fees.totalPending / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Due This Week</span>
              <span className="text-red-700 font-bold">₹{(data.overview.fees.dueThisWeek / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Monthly Target</span>
              <span className="text-blue-700 font-bold">₹{(data.overview.fees.target / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;