import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../sidebar/SideBar";
import { BaseURL } from "../../helper/helper";

const COLORS = ["#178C4B", "#D80808", "#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function Currency({ value }) {
  return <span>Rs {Number(value || 0).toLocaleString()}</span>;
}

function SectionCard({ title, right, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function BalanceSheet() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [yearlyIncomeData, setYearlyIncomeData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState({ today: 0, yesterday: 0, month: 0 });
  const [expenseSummary, setExpenseSummary] = useState({ today: 0, yesterday: 0, month: 0 });
  const [loading, setLoading] = useState(true);
  const [downloadPeriod, setDownloadPeriod] = useState("yearly");
  const [downloadYear, setDownloadYear] = useState(new Date().getFullYear());
  const [downloadMonth, setDownloadMonth] = useState(new Date().getMonth() + 1);

  // Arrays for the dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 },
  ];

  // Fetch all data when year or month changes
  useEffect(() => {
    fetchAllData();
  }, [selectedYear, selectedMonth]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchIncome(),
        fetchExpenses(),
        fetchIncomeSummary(),
        fetchExpenseSummary(),
        fetchYearlyIncomeData(),
        fetchYearlyExpenseData()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncome = async () => {
    try {
      // For custom month/year selection, we need to create a custom filter
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0); // Last day of the month
      
      // If your backend supports date range filtering
      const res = await axios.get(`${BaseURL}/accounts/income`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setIncomeData(res.data.incomes || []);
    } catch (error) {
      console.error("Error fetching income:", error);
      // Fallback to using filter parameter if date range not supported
      try {
        const res = await axios.get(`${BaseURL}/accounts/income?filter=thisMonth`);
        setIncomeData(res.data.incomes || []);
      } catch (fallbackError) {
        console.error("Fallback income fetch failed:", fallbackError);
      }
    }
  };

  const fetchExpenses = async () => {
    try {
      // For custom month/year selection, we need to create a custom filter
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0); // Last day of the month
      
      const res = await axios.get(`${BaseURL}/accounts/expense`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setExpenseData(res.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      // Fallback to using filter parameter if date range not supported
      try {
        const res = await axios.get(`${BaseURL}/accounts/expense?filter=thisMonth`);
        setExpenseData(res.data.expenses || []);
      } catch (fallbackError) {
        console.error("Fallback expense fetch failed:", fallbackError);
      }
    }
  };

  const fetchIncomeSummary = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/income-summary`);
      setIncomeSummary(res.data);
    } catch (error) {
      console.error("Error fetching income summary:", error);
    }
  };

  const fetchExpenseSummary = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/expense-summary`);
      setExpenseSummary(res.data);
    } catch (error) {
      console.error("Error fetching expense summary:", error);
    }
  };

  const fetchYearlyIncomeData = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/income/yearly-summary?year=${selectedYear}`);
      setYearlyIncomeData(res.data);
    } catch (error) {
      console.error("Error fetching yearly income data:", error);
    }
  };

  const fetchYearlyExpenseData = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/expense/yearly-summary?year=${selectedYear}`);
      setYearlyExpenseData(res.data);
    } catch (error) {
      console.error("Error fetching yearly expense data:", error);
    }
  };

  const handleDownload = async (type) => {
    try {
      let params = { period: downloadPeriod, year: downloadYear, format: 'pdf' };
      if (downloadPeriod === "monthly") {
        params.month = downloadMonth;
      }

      const endpoint = type === 'income' 
        ? `${BaseURL}/accounts/income/download` 
        : `${BaseURL}/accounts/expense/download`;

      const res = await axios.get(endpoint, {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      let filename = `${type}-statement-${downloadYear}`;
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
      console.error(`Error downloading ${type} file:`, error);
    }
  };

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  // Prepare chart data - combine income and expense data
  const chartData = yearlyIncomeData.map((incomeMonth, index) => {
    const expenseMonth = yearlyExpenseData[index] || { expense: 0 };
    return {
      name: incomeMonth.name,
      income: incomeMonth.income || 0,
      expense: expenseMonth.expense || 0
    };
  });

  // Prepare pie chart data
  const incomePieData = incomeData.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.source);
    if (existing) {
      existing.value += Number(item.amount);
    } else {
      acc.push({ name: item.source, value: Number(item.amount) });
    }
    return acc;
  }, []);

  const expensePieData = expenseData.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.category);
    if (existing) {
      existing.value += Number(item.amount);
    } else {
      acc.push({ name: item.category, value: Number(item.amount) });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4 pb-3">
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Balance Sheet</h1>
                <p className="text-sm text-gray-500">Income & Expense overview with professional charts</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Year and Month Selection for Data Filtering */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400"
                    >
                      {months.map(month => (
                        <option key={month.value} value={month.value}>{month.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Download Options */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-28 relative">
                    <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Period</label>
                    <select
                      value={downloadPeriod}
                      onChange={(e) => setDownloadPeriod(e.target.value)}
                      className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400"
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
                      className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400"
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
                        className="w-full border-2 border-gray-200 bg-transparent text-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-400"
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>{month.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload('income')}
                    className="border-2 border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Income Report</span>
                  </button>

                  <button
                    onClick={() => handleDownload('expense')}
                    className="border-2 border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Expense Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-emerald-700">Total Income</div>
                <div className="mt-1 text-3xl font-bold text-emerald-900">
                  <Currency value={totalIncome} />
                </div>
                <div className="mt-2 text-xs text-emerald-600">
                  {months.find(m => m.value === selectedMonth)?.name} {selectedYear}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-rose-100 via-rose-50 to-white border border-rose-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-rose-700">Total Expense</div>
                <div className="mt-1 text-3xl font-bold text-rose-900">
                  <Currency value={totalExpenses} />
                </div>
                <div className="mt-2 text-xs text-rose-600">
                  {months.find(m => m.value === selectedMonth)?.name} {selectedYear}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-white border border-indigo-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-indigo-700">Net Balance</div>
                <div className={`mt-1 text-3xl font-bold ${netProfit >= 0 ? "text-indigo-900" : "text-rose-700"}`}>
                  <Currency value={netProfit} />
                </div>
                <div className="mt-2 text-xs text-indigo-600">Income − Expense</div>
              </div>
            </div>

            {/* Chart + Pies */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SectionCard
                title="Income vs Expense — Yearly"
                right={<span className="text-xs text-gray-500">{selectedYear}</span>}
              >
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(val) => `Rs ${Number(val).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#178C4B" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#D80808" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Income Sources (Share)">
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(val) => `Rs ${Number(val).toLocaleString()}`} />
                      <Legend />
                      <Pie data={incomePieData} dataKey="value" nameKey="name" outerRadius={110} label>
                        {incomePieData.map((_, i) => (
                          <Cell key={`inc-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Expense Breakdown (Share)">
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(val) => `Rs ${Number(val).toLocaleString()}`} />
                      <Legend />
                      <Pie data={expensePieData} dataKey="value" nameKey="name" outerRadius={110} label>
                        {expensePieData.map((_, i) => (
                          <Cell key={`exp-${i}`} fill={COLORS[(i + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionCard
                title="Income Details"
                right={<span className="text-xs text-gray-500">{incomeData.length} records</span>}
              >
                <div className="overflow-auto rounded-xl border border-gray-200 max-h-96">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Source</th>
                        <th className="text-left px-4 py-3">Description</th>
                        <th className="text-right px-4 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {incomeData.map((r) => {
                        const d = new Date(r.date);
                        return (
                          <tr key={r._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{d.toLocaleDateString("en-PK", { month: "short", day: "numeric" })}</td>
                            <td className="px-4 py-3">{r.source}</td>
                            <td className="px-4 py-3 text-gray-500">{r.description || "N/A"}</td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600"><Currency value={r.amount} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 sticky bottom-0">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium" colSpan={3}>Total</td>
                        <td className="px-4 py-3 text-right font-bold"><Currency value={totalIncome} /></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </SectionCard>

              <SectionCard
                title="Expense Details"
                right={<span className="text-xs text-gray-500">{expenseData.length} records</span>}
              >
                <div className="overflow-auto rounded-xl border border-gray-200 max-h-96">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Category</th>
                        <th className="text-left px-4 py-3">Description</th>
                        <th className="text-right px-4 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {expenseData.map((r) => {
                        const d = new Date(r.date);
                        return (
                          <tr key={r._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{d.toLocaleDateString("en-PK", { month: "short", day: "numeric" })}</td>
                            <td className="px-4 py-3">{r.category}</td>
                            <td className="px-4 py-3 text-gray-500">{r.description || "N/A"}</td>
                            <td className="px-4 py-3 text-right font-semibold text-red-600"><Currency value={r.amount} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 sticky bottom-0">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium" colSpan={3}>Total</td>
                        <td className="px-4 py-3 text-right font-bold"><Currency value={totalExpenses} /></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}