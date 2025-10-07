import React, { useState, useEffect } from "react";
import SideBar from "../sidebar/SideBar";
import StatsOverview from "./dashboard/StatsOverview";
import AttendanceCharts from "./dashboard/AttendanceCharts";
import FinanceOverview from "./dashboard/FinanceOverview";
import QuickActionsPanel from "./dashboard/QuickActionsPanel";
import RecentActivities from "./dashboard/RecentActivities";
import CalendarWidget from "./dashboard/CalendarWidget";
import StudentDistribution from "./dashboard/StudentDistribution";
import LoadingSpinner from "../ui/LoadingSpinner";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("today");
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulated API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        // Real-time Stats
        overview: {
          students: {
            total: 1247,
            newToday: 12,
            newThisMonth: 45,
            change: "+8%", // vs last month
            trend: "up"
          },
          teachers: {
            total: 68,
            presentToday: 62,
            change: "+2%",
            trend: "up"
          },
          staff: {
            total: 24,
            presentToday: 22,
            change: "+5%",
            trend: "up"
          },
          attendance: {
            students: {
              present: 1156,
              absent: 91,
              rate: 92.7,
              change: "+1.2%"
            },
            staff: {
              present: 84,
              absent: 8,
              rate: 91.3,
              change: "+0.8%"
            }
          },
          fees: {
            totalPending: 234500,
            collectedToday: 12500,
            collectedThisMonth: 456800,
            dueThisWeek: 89500,
            target: 500000,
            achievement: 91.4
          },
          admissions: {
            today: 12,
            thisMonth: 45,
            change: "+15%",
            trend: "up"
          }
        },

        // Charts Data
        charts: {
          monthlyAttendance: [
            { month: 'Jan', students: 92, teachers: 94 },
            { month: 'Feb', students: 95, teachers: 96 },
            { month: 'Mar', students: 93, teachers: 92 },
            { month: 'Apr', students: 91, teachers: 95 },
            { month: 'May', students: 94, teachers: 93 },
            { month: 'Jun', students: 92, teachers: 94 }
          ],
          feeCollection: [
            { month: 'Jan', target: 500, actual: 420 },
            { month: 'Feb', target: 500, actual: 380 },
            { month: 'Mar', target: 500, actual: 450 },
            { month: 'Apr', target: 500, actual: 410 },
            { month: 'May', target: 500, actual: 480 },
            { month: 'Jun', target: 500, actual: 520 }
          ],
          studentDistribution: {
            byClass: [
              { class: '1-5', students: 400 },
              { class: '6-8', students: 350 },
              { class: '9-10', students: 300 },
              { class: '11-12', students: 197 }
            ],
            byGender: [
              { gender: 'Boys', count: 670 },
              { gender: 'Girls', count: 577 }
            ]
          }
        },

        // Recent Activities
        activities: [
          {
            id: 1,
            type: 'admission',
            title: 'New Student Admission',
            description: 'Priya Singh admitted to Class 10-A',
            time: '10:30 AM',
            timestamp: new Date(),
            user: 'Admin'
          },
          {
            id: 2,
            type: 'fee_payment',
            title: 'Fee Payment Received',
            description: 'Rahul Sharma paid ₹2,500',
            time: '9:45 AM',
            timestamp: new Date(),
            amount: 2500
          },
          {
            id: 3,
            type: 'attendance',
            title: 'Attendance Marked',
            description: 'Class 10-A attendance submitted',
            time: '9:00 AM',
            timestamp: new Date(),
            class: '10-A'
          },
          {
            id: 4,
            type: 'notice',
            title: 'New Notice Published',
            description: 'Annual Sports Day announcement',
            time: '8:30 AM',
            timestamp: new Date()
          },
          {
            id: 5,
            type: 'login',
            title: 'User Login',
            description: 'Mrs. Sharma logged in',
            time: '8:15 AM',
            timestamp: new Date(),
            user: 'Mrs. Sharma'
          }
        ],

        // Calendar Events
        events: [
          {
            id: 1,
            title: 'Annual Sports Day',
            date: new Date(new Date().setDate(new Date().getDate() + 2)),
            type: 'event'
          },
          {
            id: 2,
            title: 'PTM - Class 10',
            date: new Date(new Date().setDate(new Date().getDate() + 5)),
            type: 'meeting'
          },
          {
            id: 3,
            title: 'Science Exhibition',
            date: new Date(new Date().setDate(new Date().getDate() + 7)),
            type: 'event'
          },
          {
            id: 4,
            title: 'Quarterly Exams Start',
            date: new Date(new Date().setDate(new Date().getDate() + 10)),
            type: 'exam'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <>
        <SideBar />
        <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <LoadingSpinner message="Loading Dashboard Data..." />
        </div>
      </>
    );
  }

  return (
    <>
      <SideBar />
      <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
        <div className="p-4 lg:p-6 space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                School Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            
            {/* Time Range Filter */}
            <div className="flex items-center gap-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                {['overview', 'attendance', 'finance'].map(view => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-1 text-sm rounded-md capitalize ${
                      activeView === view 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview data={dashboardData.overview} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column - Charts */}
            <div className="xl:col-span-2 space-y-6">
              {activeView === 'overview' && (
                <>
                  <AttendanceCharts data={dashboardData.charts} />
                  <StudentDistribution data={dashboardData.charts.studentDistribution} />
                </>
              )}
              
              {activeView === 'attendance' && (
                <AttendanceCharts data={dashboardData.charts} detailed />
              )}
              
              {activeView === 'finance' && (
                <FinanceOverview data={dashboardData} />
              )}
            </div>

            {/* Right Column - Widgets */}
            <div className="space-y-6">
              <QuickActionsPanel />
              <CalendarWidget events={dashboardData.events} />
              <RecentActivities activities={dashboardData.activities} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;