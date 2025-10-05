import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Sidebar from "../sidebar/SideBar";
import { BaseURL } from "../../helper/helper";

// MonthlyBarChart component
function MonthlyBarChart({ data, year }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Income & Expense for {year}</h2>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="98%" height="90%">
          <BarChart
            data={data}
            margin={{
              top: 30,
              right: 25,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#178C4B" name="Income" />
            <Bar dataKey="expense" fill="#D80808" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const Expense = () => {
  const [form, setForm] = useState({ category: "", amount: "", date: "", description: "" });
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState("today");
  const [summary, setSummary] = useState({ today: 0, yesterday: 0, month: 0 });
  const [showModal, setShowModal] = useState(false);
  const [downloadPeriod, setDownloadPeriod] = useState("yearly");
  const [downloadYear, setDownloadYear] = useState(new Date().getFullYear());
  const [downloadMonth, setDownloadMonth] = useState(new Date().getMonth() + 1);
  const [chartData, setChartData] = useState([]);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  useEffect(() => {
    fetchChartData();
  }, [chartYear]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/expense?filter=${filters}`);
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/expense-summary`);
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

 // --- Updated Function to Fetch Combined Chart Data ---
const fetchChartData = async () => {
  try {
    // Fetch both income and expense data for the selected year
    const [incomeRes, expenseRes] = await Promise.all([
      axios.get(`${BaseURL}/accounts/income/yearly-summary?year=${chartYear}`),
      axios.get(`${BaseURL}/accounts/expense/yearly-summary?year=${chartYear}`)
    ]);
    
    const incomeData = incomeRes.data;
    const expenseData = expenseRes.data;
    
    // Combine the data
    const combinedData = incomeData.map((incomeMonth, index) => {
      const expenseMonth = expenseData[index] || { expense: 0 };
      return {
        name: incomeMonth.name,
        income: incomeMonth.income || 0,
        expense: expenseMonth.expense || 0
      };
    });
    
    setChartData(combinedData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseURL}/accounts/expense`, form);
      setForm({ category: "", amount: "", date: "", description: "" });
      setShowModal(false);
      fetchExpenses();
      fetchSummary();
      fetchChartData();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDownload = async () => {
    try {
      let params = { period: downloadPeriod, year: downloadYear, format: 'pdf' };
      if (downloadPeriod === "monthly") {
        params.month = downloadMonth;
      }

      const res = await axios.get(`${BaseURL}/accounts/expense/download`, {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      let filename = `expense-statement-${downloadYear}`;
      if (downloadPeriod === 'monthly') {
        filename += `-${downloadMonth}`;
      }
      filename += '.pdf';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 },
  ];

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4 pb-3">
          {/* Summary Cards - Adjusted for Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 pt-5">
            {/* Today Expense */}
            <div className="bg-gradient-to-br from-red-100/80 via-red-50 to-white border border-red-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800">Today Expense</h3>
              </div>
              <p className="text-3xl font-bold text-red-900">Rs {summary.today}</p>
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Live updates</span>
              </div>
            </div>

            {/* Yesterday Expense */}
            <div className="bg-gradient-to-br from-orange-100/80 via-orange-50 to-white border border-orange-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-orange-800">Yesterday Expense</h3>
              </div>
              <p className="text-3xl font-bold text-orange-900">Rs {summary.yesterday}</p>
              <div className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                <span>From previous day</span>
              </div>
            </div>

            {/* This Month Expense */}
            <div className="bg-gradient-to-br from-fuchsia-100/80 via-fuchsia-50 to-white border border-fuchsia-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-fuchsia-100 rounded-lg text-fuchsia-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-fuchsia-800">This Month Expense</h3>
              </div>
              <p className="text-3xl font-bold text-fuchsia-900">Rs {summary.month}</p>
              <div className="mt-2 text-sm text-fuchsia-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Growing trend</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-gray-800">Monthly Overview</h2>
              {/* Year Selector for Chart */}
              <div className="relative">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Select Year</label>
                <select
                  value={chartYear}
                  onChange={(e) => setChartYear(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-red-400"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4">
              <MonthlyBarChart data={chartData} year={chartYear} />
            </div>
          </div>

          {/* Filter, Download and Add Expense Button Section */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6 pt-5">
            {/* Filter */}
            <div className="relative">
              <label className="absolute -top-3 left-2 bg-white px-1 text-sm text-gray-500">Filter By</label>
              <select
                value={filters}
                onChange={(e) => setFilters(e.target.value)}
                className="w-full border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisMonth">This Month</option>
                <option value="yearly">This Year</option>
                <option value="previousYear">Previous Year</option>
              </select>
            </div>

            {/* Download Section */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-28 relative">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Period</label>
                <select
                  value={downloadPeriod}
                  onChange={(e) => setDownloadPeriod(e.target.value)}
                  className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-red-400"
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Year</label>
                <select
                  value={downloadYear}
                  onChange={(e) => setDownloadYear(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-red-400"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {downloadPeriod === "monthly" && (
                <div className="relative">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Month</label>
                  <select
                    value={downloadMonth}
                    onChange={(e) => setDownloadMonth(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-red-400"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="border-2 border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="fixed sm:static bottom-4 right-4 sm:bottom-auto sm:right-auto bg-gradient-to-r from-red-500 to-rose-600 text-white p-3 sm:px-5 sm:py-2.5 rounded-full sm:rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>

          {/* Modal Form for adding new expense */}
          {showModal && (
            <div className="fixed inset-0 px-2 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Groceries, Fuel, etc."
                      className="w-full p-2 border rounded"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-2 border rounded"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="Additional details"
                      className="w-full p-2 border rounded"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
                    >
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto scrollbar-hide rounded-xl shadow-sm border border-[#E0E7FF] ">
            <table className="min-w-full table-auto ">
              <thead>
                <tr className="bg-gradient-to-r from-[#F2F5FF] to-[#E7F0FF]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#3E54AC]">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#3E54AC]">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#3E54AC]">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#3E54AC]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7FF] bg-white">
                {expenses.map((item) => {
                  const parts = item.date.split('-');
                  const displayDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

                  return (
                    <tr key={item._id} className="hover:bg-[#F2F5FF] transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-[#1A237E]">
                        {displayDate.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#3E54AC]">
                        {item.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-mono font-bold text-[#4A6BFF]">
                        Rs {item.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 border border-red-200">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-[#F2F5FF]">
                <tr>
                  <td colSpan="4" className="px-6 py-3 text-right text-sm text-[#3E54AC] font-medium">
                    Total: Rs {expenses.reduce((sum, item) => sum + Number(item.amount), 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expense;