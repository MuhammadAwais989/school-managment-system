import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/SideBar";
import { BaseURL } from "../../helper/helper";

const Income = () => {
  const [form, setForm] = useState({ source: "", amount: "", date: "", description: "" });
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState("today");
  const [summary, setSummary] = useState({ today: 0, yesterday: 0, month: 0 });

  useEffect(() => {
    fetchIncome();
    fetchSummary();
  }, [filters]);

  const fetchIncome = async () => {
    const res = await axios.get(`${BaseURL}/accounts/income?filter=${filters}`);
    setIncomes(res.data.incomes);
  };

  const fetchSummary = async () => {
    const res = await axios.get(`${BaseURL}/accounts/income-summary`);
    setSummary(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${BaseURL}/accounts/income`, form);
    setForm({ source: "", amount: "", date: "", description: "" });
    fetchIncome();
    fetchSummary();
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4">


          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 pt-5 px-4">
            {/* Today Income */}
            <div className="bg-gradient-to-br from-cyan-100/80 via-cyan-50 to-white border border-cyan-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-cyan-800">Today Income</h3>
              </div>
              <p className="text-3xl font-bold text-cyan-900">Rs {summary.today}</p>
              <div className="mt-2 text-sm text-cyan-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Live updates</span>
              </div>
            </div>

            {/* Yesterday Income */}
            <div className="bg-gradient-to-br from-purple-100/80 via-purple-50 to-white border border-purple-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-800">Yesterday Income</h3>
              </div>
              <p className="text-3xl font-bold text-purple-900">Rs {summary.yesterday}</p>
              <div className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
                <span>From previous day</span>
              </div>
            </div>

            {/* This Month Income */}
            <div className="bg-gradient-to-br from-indigo-100/80 via-indigo-50 to-white border border-indigo-200 rounded-xl shadow-sm p-5 group hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-indigo-800">This Month Income</h3>
              </div>
              <p className="text-3xl font-bold text-indigo-900">Rs {summary.month}</p>
              <div className="mt-2 text-sm text-indigo-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Growing trend</span>
              </div>
            </div>
          </div>
            <button
                className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 max-sm:text-sm">
                Add Income
              </button>
          {/* Add Income Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Source" className="border p-2 rounded" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
            <input type="number" placeholder="Amount" className="border p-2 rounded" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <input type="date" className="border p-2 rounded" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="text" placeholder="Description" className="border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Income</button>
          </form>

          {/* Filter */}
          <div className="mb-4">
            <select value={filters} onChange={(e) => setFilters(e.target.value)} className="border p-2 rounded">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisMonth">This Month</option>
              <option value="yearly">This Year</option>
              <option value="previousYear">Previous Year</option>
            </select>
          </div>

          {/* Income Table */}
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Date</th>
                <th className="border p-2">Source</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="border p-2">{item.source}</td>
                  <td className="border p-2">Rs {item.amount}</td>
                  <td className="border p-2">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Income;
