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
import Loading from "../Loading";
import PageTitle from "../PageTitle";
import { LuFileText } from "react-icons/lu";

const COLORS = [
  "#178C4B",
  "#D80808",
  "#2563eb",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
];

function Currency({ value }) {
  return <span>Rs {Number(value || 0).toLocaleString()}</span>;
}

function SectionCard({ title, right, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function BalanceSheet() {
  const [timeRange, setTimeRange] = useState("thisMonth");
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [yearlyIncomeData, setYearlyIncomeData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState({
    today: 0,
    yesterday: 0,
    month: 0,
  });
  const [expenseSummary, setExpenseSummary] = useState({
    today: 0,
    yesterday: 0,
    month: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterPeriod, setFilterPeriod] = useState("yearly");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filteredIncome, setFilteredIncome] = useState(0);
  const [filteredExpense, setFilteredExpense] = useState(0);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [filteredIncomePieData, setFilteredIncomePieData] = useState([]);
  const [filteredExpensePieData, setFilteredExpensePieData] = useState([]);
  const [filteredIncomeData, setFilteredIncomeData] = useState([]);
  const [filteredExpenseData, setFilteredExpenseData] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  // Fetch filtered data when filter values change
  useEffect(() => {
    fetchFilteredData();
  }, [filterPeriod, filterYear, filterMonth]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchIncome(),
        fetchExpenses(),
        fetchIncomeSummary(),
        fetchExpenseSummary(),
        fetchYearlyIncomeData(),
        fetchYearlyExpenseData(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    setFilterLoading(true);
    try {
      const incomeParams = { period: filterPeriod, year: filterYear };
      const expenseParams = { period: filterPeriod, year: filterYear };

      if (filterPeriod === "monthly") {
        incomeParams.month = filterMonth;
        expenseParams.month = filterMonth;
      }

      const [
        incomeRes,
        expenseRes,
        chartRes,
        incomePieRes,
        expensePieRes,
        incomeDataRes,
        expenseDataRes,
      ] = await Promise.all([
        axios.get(`${BaseURL}/accounts/income/filtered-summary`, {
          params: incomeParams,
        }),
        axios.get(`${BaseURL}/accounts/expense/filtered-summary`, {
          params: expenseParams,
        }),
        axios.get(`${BaseURL}/accounts/income-expense-chart`, {
          params:
            filterPeriod === "yearly"
              ? { year: filterYear }
              : { year: filterYear, month: filterMonth },
        }),
        axios.get(`${BaseURL}/accounts/income-pie`, { params: incomeParams }),
        axios.get(`${BaseURL}/accounts/expense-pie`, { params: expenseParams }),
        // FIXED: Use filtered-data endpoints instead of regular endpoints
        axios.get(`${BaseURL}/accounts/income/filtered-data`, {
          params: incomeParams,
        }),
        axios.get(`${BaseURL}/accounts/expense/filtered-data`, {
          params: expenseParams,
        }),
      ]);

      setFilteredIncome(incomeRes.data.total || 0);
      setFilteredExpense(expenseRes.data.total || 0);
      setFilteredChartData(chartRes.data || []);
      setFilteredIncomePieData(incomePieRes.data || []);
      setFilteredExpensePieData(expensePieRes.data || []);

      // FIXED: Handle different response formats from filtered-data endpoints
      setFilteredIncomeData(
        incomeDataRes.data.incomes || incomeDataRes.data || []
      );
      setFilteredExpenseData(
        expenseDataRes.data.expenses || expenseDataRes.data || []
      );
    } catch (error) {
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchIncome = async () => {
    try {
      const res = await axios.get(
        `${BaseURL}/accounts/income?filter=${timeRange}`
      );
      setIncomeData(res.data.incomes || []);
    } catch (error) {
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${BaseURL}/accounts/expense?filter=${timeRange}`
      );
      setExpenseData(res.data.expenses || []);
    } catch (error) {
    }
  };

  const fetchIncomeSummary = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/income-summary`);
      setIncomeSummary(res.data);
    } catch (error) {
    }
  };

  const fetchExpenseSummary = async () => {
    try {
      const res = await axios.get(`${BaseURL}/accounts/expense-summary`);
      setExpenseSummary(res.data);
    } catch (error) {
    }
  };

  const fetchYearlyIncomeData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const res = await axios.get(
        `${BaseURL}/accounts/income/yearly-summary?year=${currentYear}`
      );
      setYearlyIncomeData(res.data);
    } catch (error) {
    }
  };

  const fetchYearlyExpenseData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const res = await axios.get(
        `${BaseURL}/accounts/expense/yearly-summary?year=${currentYear}`
      );
      setYearlyExpenseData(res.data);
    } catch (error) {
    }
  };

  const handleDownloadBalanceSheet = async () => {
    try {
      let params = { period: filterPeriod, year: filterYear };
      if (filterPeriod === "monthly") {
        params.month = filterMonth;
      }

      const res = await axios.get(
        `${BaseURL}/accounts/balance-sheet/download`,
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      let filename = `balance-sheet-${filterYear}`;
      if (filterPeriod === "monthly") {
        filename += `-${filterMonth}`;
      }
      filename += ".pdf";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download balance sheet. Please try again.");
    }
  };

  // Calculate totals
  const totalIncome = incomeData.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
  const totalExpenses = expenseData.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
  const netProfit = totalIncome - totalExpenses;
  const filteredNetProfit = filteredIncome - filteredExpense;

  // Prepare chart data - combine income and expense data
  const chartData = yearlyIncomeData.map((incomeMonth, index) => {
    const expenseMonth = yearlyExpenseData[index] || { expense: 0 };
    return {
      name: incomeMonth.name,
      income: incomeMonth.income || 0,
      expense: expenseMonth.expense || 0,
    };
  });

  // Prepare pie chart data
  const incomePieData = incomeData.reduce((acc, item) => {
    const existing = acc.find((i) => i.name === item.source);
    if (existing) {
      existing.value += Number(item.amount);
    } else {
      acc.push({ name: item.source, value: Number(item.amount) });
    }
    return acc;
  }, []);

  const expensePieData = expenseData.reduce((acc, item) => {
    const existing = acc.find((i) => i.name === item.category);
    if (existing) {
      existing.value += Number(item.amount);
    } else {
      acc.push({ name: item.category, value: Number(item.amount) });
    }
    return acc;
  }, []);

  // Arrays for the dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { name: "Jan", value: 1 },
    { name: "Feb", value: 2 },
    { name: "Mar", value: 3 },
    { name: "Apr", value: 4 },
    { name: "May", value: 5 },
    { name: "Jun", value: 6 },
    { name: "Jul", value: 7 },
    { name: "Aug", value: 8 },
    { name: "Sep", value: 9 },
    { name: "Oct", value: 10 },
    { name: "Nov", value: 11 },
    { name: "Dec", value: 12 },
  ];

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <Loading type="skeleton" skeletonType="fees" />
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4 pt-2 pb-3">
          <div className=" z-20 bg-white border-b border-gray-200 ">
            <PageTitle
              title="Balance Sheet"
              description="Income & Expense overview"
              icon={LuFileText} // ya koi aur relevant icon
              bgGradient="bg-gradient-to-r from-violet-50 to-purple-50"
              borderColor="border-violet-200"
              iconBg="bg-gradient-to-r from-violet-500 to-purple-500"
              // Filter props
              showFilters={true}
              filterPeriod={filterPeriod}
              setFilterPeriod={setFilterPeriod}
              filterYear={filterYear}
              setFilterYear={setFilterYear}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              onDownload={handleDownloadBalanceSheet}
              years={years}
              months={months}
            />
          </div>

          <div className="py-2 space-y-6">
            {/* Filtered KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-emerald-700">
                  Total Income
                </div>
                <div className="mt-1 text-3xl font-bold text-emerald-900">
                  {filterLoading ? (
                    <div className="animate-pulse h-8 bg-emerald-200 rounded"></div>
                  ) : (
                    <Currency value={filteredIncome} />
                  )}
                </div>
                <div className="mt-2 text-xs text-emerald-600">
                  {filterPeriod === "yearly"
                    ? `Year: ${filterYear}`
                    : `${
                        months.find((m) => m.value === filterMonth)?.name
                      } ${filterYear}`}
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-100 via-rose-50 to-white border border-rose-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-rose-700">
                  Total Expense
                </div>
                <div className="mt-1 text-3xl font-bold text-rose-900">
                  {filterLoading ? (
                    <div className="animate-pulse h-8 bg-rose-200 rounded"></div>
                  ) : (
                    <Currency value={filteredExpense} />
                  )}
                </div>
                <div className="mt-2 text-xs text-rose-600">
                  {filterPeriod === "yearly"
                    ? `Year: ${filterYear}`
                    : `${
                        months.find((m) => m.value === filterMonth)?.name
                      } ${filterYear}`}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-white border border-indigo-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-indigo-700">
                  Net Balance
                </div>
                <div
                  className={`mt-1 text-3xl font-bold ${
                    filteredNetProfit >= 0 ? "text-indigo-900" : "text-rose-700"
                  }`}
                >
                  {filterLoading ? (
                    <div className="animate-pulse h-8 bg-indigo-200 rounded"></div>
                  ) : (
                    <Currency value={filteredNetProfit} />
                  )}
                </div>
                <div className="mt-2 text-xs text-indigo-600">
                  {filterPeriod === "yearly"
                    ? `Year: ${filterYear}`
                    : `${
                        months.find((m) => m.value === filterMonth)?.name
                      } ${filterYear}`}
                </div>
              </div>
            </div>

            {/* Chart + Pies */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SectionCard
                title={`Income vs Expense — ${
                  filterPeriod === "yearly"
                    ? filterYear
                    : `${
                        months.find((m) => m.value === filterMonth)?.name
                      } ${filterYear}`
                }`}
                right={
                  <span className="text-xs text-gray-500">
                    {filterPeriod === "yearly" ? "Yearly" : "Monthly"}
                  </span>
                }
              >
                <div className="w-full h-[320px]">
                  {filterLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredChartData}
                        margin={{ top: 12, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(val) =>
                            `Rs ${Number(val).toLocaleString()}`
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="income"
                          name="Income"
                          fill="#178C4B"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="expense"
                          name="Expense"
                          fill="#D80808"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Income Sources">
                <div className="w-full h-[320px]">
                  {filterLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          formatter={(val) =>
                            `Rs ${Number(val).toLocaleString()}`
                          }
                        />
                        <Legend />
                        <Pie
                          data={filteredIncomePieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={110}
                          label
                        >
                          {filteredIncomePieData.map((_, i) => (
                            <Cell
                              key={`inc-${i}`}
                              fill={COLORS[i % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Expense Breakdown">
                <div className="w-full h-[320px]">
                  {filterLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          formatter={(val) =>
                            `Rs ${Number(val).toLocaleString()}`
                          }
                        />
                        <Legend />
                        <Pie
                          data={filteredExpensePieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={110}
                          label
                        >
                          {filteredExpensePieData.map((_, i) => (
                            <Cell
                              key={`exp-${i}`}
                              fill={COLORS[(i + 2) % COLORS.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionCard
                title="Income Details"
                right={
                  <span className="text-xs text-gray-500">
                    {" "}
                    {filteredIncomeData.length} records
                  </span>
                }
              >
                <div className="overflow-auto rounded-xl border border-gray-200 max-h-96">
                  {filterLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
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
                        {filteredIncomeData.map((r) => {
                          const d = new Date(r.date);
                          return (
                            <tr key={r._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                {d.toLocaleDateString("en-PK", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3">{r.source}</td>
                              <td className="px-4 py-3 text-gray-500">
                                {r.description || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-green-600">
                                <Currency value={r.amount} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50 sticky bottom-0">
                        <tr>
                          <td
                            className="px-4 py-3 text-right font-medium"
                            colSpan={3}
                          >
                            Total
                          </td>
                          <td className="px-4 py-3 text-right font-bold">
                            <Currency value={filteredIncome} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="Expense Details"
                right={
                  <span className="text-xs text-gray-500">
                    {filteredExpenseData.length} records
                  </span>
                }
              >
                <div className="overflow-auto rounded-xl border border-gray-200 max-h-96">
                  {filterLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
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
                        {filteredExpenseData.map((r) => {
                          const d = new Date(r.date);
                          return (
                            <tr key={r._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                {d.toLocaleDateString("en-PK", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3">{r.category}</td>
                              <td className="px-4 py-3 text-gray-500">
                                {r.description || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-red-600">
                                <Currency value={r.amount} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50 sticky bottom-0">
                        <tr>
                          <td
                            className="px-4 py-3 text-right font-medium"
                            colSpan={3}
                          >
                            Total
                          </td>
                          <td className="px-4 py-3 text-right font-bold">
                            <Currency value={filteredExpense} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}