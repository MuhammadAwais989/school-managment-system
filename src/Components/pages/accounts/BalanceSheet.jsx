import React, { useMemo, useState } from "react";
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
// import Sidebar from "../sidebar/SideBar"; // Sidebar has been commented out to make this a single file component

// ——————————————————————————————————————————
// BalanceSheet: Professional UI for Income/Expense with charts
// Single-file React component, TailwindCSS + Recharts only
// Replace the sample data with your API data as needed
// ——————————————————————————————————————————

const sampleMonthly = [
  { name: "Jan", income: 5200, expense: 1200 },
  { name: "Feb", income: 6300, expense: 1800 },
  { name: "Mar", income: 5800, expense: 2100 },
  { name: "Apr", income: 7200, expense: 2400 },
  { name: "May", income: 6800, expense: 1900 },
  { name: "Jun", income: 7500, expense: 2600 },
  { name: "Jul", income: 8000, expense: 3000 },
  { name: "Aug", income: 7900, expense: 2700 },
  { name: "Sep", income: 8500, expense: 3100 },
  { name: "Oct", income: 9100, expense: 3300 },
  { name: "Nov", income: 8800, expense: 3200 },
  { name: "Dec", income: 9400, expense: 3500 },
];

const sampleIncomeSources = [
  { id: 1, source: "Product Sales", amount: 4200, date: "2025-06-02", description: "Online store" },
  { id: 2, source: "Service Revenue", amount: 1800, date: "2025-06-05", description: "Consulting session" },
  { id: 3, source: "Affiliate", amount: 650, date: "2025-06-12", description: "Partner program" },
  { id: 4, source: "Subscription", amount: 2400, date: "2025-06-20", description: "Pro plan renewals" },
];

const sampleExpenses = [
  { id: 1, category: "Marketing", amount: 700, date: "2025-06-03", description: "Ads & promotions" },
  { id: 2, category: "Operations", amount: 900, date: "2025-06-08", description: "SaaS tools" },
  { id: 3, category: "Salaries", amount: 1600, date: "2025-06-15", description: "Team payroll" },
  { id: 4, category: "Logistics", amount: 400, date: "2025-06-22", description: "Shipping & handling" },
];

const COLORS = ["#178C4B", "#D80808", "#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]; // used for pies

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
  const [range, setRange] = useState("last6"); // original filter

  // New state variables for the requested filter
  const [downloadPeriod, setDownloadPeriod] = useState("yearly");
  const [downloadYear, setDownloadYear] = useState(new Date().getFullYear());
  const [downloadMonth, setDownloadMonth] = useState(new Date().getMonth() + 1);

  const monthly = useMemo(() => {
    if (range === "last6") return sampleMonthly.slice(-6);
    if (range === "ytd") {
      // Jan to current month (simulate 10 months for the mock)
      return sampleMonthly.slice(0, 10);
    }
    return sampleMonthly; // full year
  }, [range]);

  const totals = useMemo(() => {
    const income = monthly.reduce((s, m) => s + m.income, 0);
    const expense = monthly.reduce((s, m) => s + m.expense, 0);
    const net = income - expense;
    return { income, expense, net };
  }, [monthly]);

  // build pies from detail tables (grouped sums)
  const incomePie = useMemo(() => {
    const map = new Map();
    sampleIncomeSources.forEach((r) => map.set(r.source, (map.get(r.source) || 0) + r.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, []);

  const expensePie = useMemo(() => {
    const map = new Map();
    sampleExpenses.forEach((r) => map.set(r.category, (map.get(r.category) || 0) + r.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, []);

  // Arrays for the new dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 },
  ];

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full ">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4 pb-3">
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Balance Sheet</h1>
                <p className="text-sm text-gray-500">Income & Expense overview with professional charts</p>
              </div>

              <div className="flex items-center gap-2">
                {/* New Filter Dropdowns */}
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

                {/* Download Button */}
                <button
                  className="border-2 border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border border-emerald-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-emerald-700">Total Income</div>
                <div className="mt-1 text-3xl font-bold text-emerald-900">
                  <Currency value={totals.income} />
                </div>
                <div className="mt-2 text-xs text-emerald-600">Selected range</div>
              </div>
              <div className="bg-gradient-to-br from-rose-100 via-rose-50 to-white border border-rose-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-rose-700">Total Expense</div>
                <div className="mt-1 text-3xl font-bold text-rose-900">
                  <Currency value={totals.expense} />
                </div>
                <div className="mt-2 text-xs text-rose-600">Selected range</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-white border border-indigo-200 rounded-2xl p-5">
                <div className="text-sm font-medium text-indigo-700">Net Balance</div>
                <div className={`mt-1 text-3xl font-bold ${totals.net >= 0 ? "text-indigo-900" : "text-rose-700"}`}>
                  <Currency value={totals.net} />
                </div>
                <div className="mt-2 text-xs text-indigo-600">Income − Expense</div>
              </div>
            </div>

            {/* Chart + Pies */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SectionCard
                title="Income vs Expense — Monthly"
                right={<span className="text-xs text-gray-500">{range === "last6" ? "Last 6 months" : range === "ytd" ? "YTD" : "Full year"}</span>}
              >
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
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
                      <Pie data={incomePie} dataKey="value" nameKey="name" outerRadius={110} label>
                        {incomePie.map((_, i) => (
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
                      <Pie data={expensePie} dataKey="value" nameKey="name" outerRadius={110} label>
                        {expensePie.map((_, i) => (
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
                right={<span className="text-xs text-gray-500">{sampleIncomeSources.length} records</span>}
              >
                <div className="overflow-auto rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Source</th>
                        <th className="text-left px-4 py-3">Description</th>
                        <th className="text-right px-4 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {sampleIncomeSources.map((r) => {
                        const d = new Date(r.date);
                        return (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{d.toLocaleDateString("en-PK", { month: "short", day: "numeric" })}</td>
                            <td className="px-4 py-3">{r.source}</td>
                            <td className="px-4 py-3 text-gray-500">{r.description}</td>
                            <td className="px-4 py-3 text-right font-semibold"><Currency value={r.amount} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium" colSpan={3}>Total</td>
                        <td className="px-4 py-3 text-right font-bold"><Currency value={sampleIncomeSources.reduce((s, r) => s + r.amount, 0)} /></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </SectionCard>

              <SectionCard
                title="Expense Details"
                right={<span className="text-xs text-gray-500">{sampleExpenses.length} records</span>}
              >
                <div className="overflow-auto rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left px-4 py-3">Date</th>
                        <th className="text-left px-4 py-3">Category</th>
                        <th className="text-left px-4 py-3">Description</th>
                        <th className="text-right px-4 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {sampleExpenses.map((r) => {
                        const d = new Date(r.date);
                        return (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">{d.toLocaleDateString("en-PK", { month: "short", day: "numeric" })}</td>
                            <td className="px-4 py-3">{r.category}</td>
                            <td className="px-4 py-3 text-gray-500">{r.description}</td>
                            <td className="px-4 py-3 text-right font-semibold"><Currency value={r.amount} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium" colSpan={3}>Total</td>
                        <td className="px-4 py-3 text-right font-bold"><Currency value={sampleExpenses.reduce((s, r) => s + r.amount, 0)} /></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </SectionCard>
            </div>

            {/* Notes */}
            <div className="text-xs text-gray-500 text-center pt-2">
              Replace the sample arrays with your API data. The layout is responsive and production-friendly.
            </div>
          </div>
        </div>
      </div>
    </>

  );
}
