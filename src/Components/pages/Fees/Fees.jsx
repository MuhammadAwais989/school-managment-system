import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Printer, 
  User, 
  BookOpen, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Users,
  Book,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'react-feather';

const FeesManagement = () => {
  // Define all months for the academic year
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Monthly fee structure for different classes
  const monthlyFees = {
    '9th': 1000,
    '10th': 1200,
    '11th': 1500,
    '12th': 1800
  };

  // Sample student data with month-wise dues and payments
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: 'S001',
      name: 'Ali Ahmed',
      fatherName: 'Ahmed Khan',
      class: '10th',
      section: 'A',
      monthlyFee: 1200,
      totalFees: 12000,
      paidFees: 8000,
      status: 'Partially Paid',
      dues: 4000,
      paymentHistory: [
        { date: '2023-09-15', amount: 4000, months: ['September'], mode: 'Cash' },
        { date: '2023-08-10', amount: 4000, months: ['July', 'August'], mode: 'Bank Transfer' }
      ],
      duesByMonth: [
        { month: 'January', due: 1200, paid: true },
        { month: 'February', due: 1200, paid: true },
        { month: 'March', due: 1200, paid: true },
        { month: 'April', due: 1200, paid: true },
        { month: 'May', due: 1200, paid: true },
        { month: 'June', due: 1200, paid: true },
        { month: 'July', due: 1200, paid: true },
        { month: 'August', due: 1200, paid: true },
        { month: 'September', due: 1200, paid: true },
        { month: 'October', due: 1200, paid: false },
        { month: 'November', due: 1200, paid: false },
        { month: 'December', due: 1200, paid: false }
      ]
    },
    {
      id: 2,
      rollNo: 'S002',
      name: 'Sara Khan',
      fatherName: 'Khalid Khan',
      class: '9th',
      section: 'B',
      monthlyFee: 1000,
      totalFees: 10000,
      paidFees: 10000,
      status: 'Fully Paid',
      dues: 0,
      paymentHistory: [
        { date: '2023-09-05', amount: 5000, months: ['May', 'June', 'July', 'August', 'September'], mode: 'Card' },
        { date: '2023-04-03', amount: 5000, months: ['January', 'February', 'March', 'April'], mode: 'Cash' }
      ],
      duesByMonth: [
        { month: 'January', due: 1000, paid: true },
        { month: 'February', due: 1000, paid: true },
        { month: 'March', due: 1000, paid: true },
        { month: 'April', due: 1000, paid: true },
        { month: 'May', due: 1000, paid: true },
        { month: 'June', due: 1000, paid: true },
        { month: 'July', due: 1000, paid: true },
        { month: 'August', due: 1000, paid: true },
        { month: 'September', due: 1000, paid: true },
        { month: 'October', due: 1000, paid: true },
        { month: 'November', due: 1000, paid: true },
        { month: 'December', due: 1000, paid: true }
      ]
    },
    {
      id: 3,
      rollNo: 'S003',
      name: 'Usman Ali',
      fatherName: 'Ali Raza',
      class: '11th',
      section: 'C',
      monthlyFee: 1500,
      totalFees: 15000,
      paidFees: 5000,
      status: 'Partially Paid',
      dues: 10000,
      paymentHistory: [
        { date: '2023-09-20', amount: 5000, months: ['April', 'May', 'June', 'July'], mode: 'Bank Transfer' }
      ],
      duesByMonth: [
        { month: 'January', due: 1500, paid: false },
        { month: 'February', due: 1500, paid: false },
        { month: 'March', due: 1500, paid: false },
        { month: 'April', due: 1500, paid: true },
        { month: 'May', due: 1500, paid: true },
        { month: 'June', due: 1500, paid: true },
        { month: 'July', due: 1500, paid: true },
        { month: 'August', due: 1500, paid: false },
        { month: 'September', due: 1500, paid: false },
        { month: 'October', due: 1500, paid: false },
        { month: 'November', due: 1500, paid: false },
        { month: 'December', due: 1500, paid: false }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMonths, setPaymentMonths] = useState([]);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('fees');
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Handle fee payment
  const handlePayment = (student) => {
    if (!paymentAmount || paymentAmount <= 0 || paymentAmount > student.dues) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (paymentMonths.length === 0) {
      alert('Please select at least one month for payment');
      return;
    }

    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        const newPaidFees = s.paidFees + parseInt(paymentAmount);
        const newDues = s.totalFees - newPaidFees;
        const newStatus = newDues === 0 ? 'Fully Paid' : 'Partially Paid';
        
        // Update duesByMonth to mark selected months as paid
        const updatedDuesByMonth = s.duesByMonth.map(monthData => {
          if (paymentMonths.includes(monthData.month)) {
            return { ...monthData, paid: true };
          }
          return monthData;
        });
        
        return {
          ...s,
          paidFees: newPaidFees,
          dues: newDues,
          status: newStatus,
          duesByMonth: updatedDuesByMonth,
          paymentHistory: [
            ...s.paymentHistory,
            {
              date: new Date().toISOString().split('T')[0],
              amount: parseInt(paymentAmount),
              months: [...paymentMonths],
              mode: paymentMode
            }
          ]
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentMonths([]);
  };

  // Toggle month selection for payment
  const toggleMonthSelection = (month) => {
    if (paymentMonths.includes(month)) {
      setPaymentMonths(paymentMonths.filter(m => m !== month));
    } else {
      setPaymentMonths([...paymentMonths, month]);
    }
  };

  // Generate challan (PDF) - In a real app, this would generate an actual PDF
  const generateChallan = (student) => {
    alert(`Challan generated for ${student.name}. In a real application, this would download a PDF.`);
  };

  // Generate report - In a real app, this would generate a detailed report
  const generateReport = (student) => {
    alert(`Report generated for ${student.name}. In a real application, this would download a detailed report.`);
  };

  // Get status icon and color
  const getStatusIcon = (status) => {
    if (status === 'Fully Paid') {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (status === 'Partially Paid') {
      return <AlertCircle size={16} className="text-yellow-500" />;
    } else {
      return <XCircle size={16} className="text-red-500" />;
    }
  };

  // Toggle student details expansion
  const toggleStudentExpansion = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'fees', label: 'Fees Management', icon: <DollarSign size={20} /> },
    { id: 'courses', label: 'Courses', icon: <Book size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Calculate summary data
  const totalStudents = students.length;
  const totalFeesCollection = students.reduce((sum, student) => sum + student.paidFees, 0);
  const totalDues = students.reduce((sum, student) => sum + student.dues, 0);
  const fullyPaidStudents = students.filter(student => student.status === 'Fully Paid').length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}>
        <div className="text-white flex items-center space-x-2 px-4">
          <BookOpen className="h-8 w-8" />
          <span className="text-2xl font-extrabold">EduManage</span>
        </div>
        
        <nav>
          {navItems.map(item => (
            <a
              key={item.id}
              href="#"
              className={`py-2.5 px-4 rounded flex items-center space-x-2 transition duration-200 ${activeView === item.id ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          
          <a
            href="#"
            className="py-2.5 px-4 rounded flex items-center space-x-2 transition duration-200 hover:bg-blue-700 mt-4"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center ml-4">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
            <p className="text-gray-600">Manage student fees, generate reports and challans</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                  <Users size={20} />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm">Total Students</h2>
                  <p className="text-xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-500">
                  <DollarSign size={20} />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm">Fees Collected</h2>
                  <p className="text-xl font-bold">Rs. {totalFeesCollection}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 text-red-500">
                  <AlertCircle size={20} />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm">Total Dues</h2>
                  <p className="text-xl font-bold">Rs. {totalDues}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                  <CheckCircle size={20} />
                </div>
                <div className="ml-4">
                  <h2 className="text-gray-500 text-sm">Fully Paid</h2>
                  <p className="text-xl font-bold">{fullyPaidStudents} Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="All">All Classes</option>
                  <option value="9th">9th</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Fully Paid">Fully Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Not Paid">Not Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actions</label>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <Download size={16} className="mr-1" />
                    Export
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <Printer size={16} className="mr-1" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Father Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Class/Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Total Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Dues</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <React.Fragment key={student.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleStudentExpansion(student.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {expandedStudent === student.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.rollNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.fatherName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.class} - {student.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Rs. {student.totalFees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Rs. {student.paidFees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={student.dues > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                            Rs. {student.dues}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(student.status)}
                            <span className="ml-1">{student.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                              setShowPaymentModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2 text-xs"
                            disabled={student.dues === 0}
                          >
                            <DollarSign size={14} className="inline mr-1" />
                            Pay
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateChallan(student);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2 text-xs"
                          >
                            <Printer size={14} className="inline mr-1" />
                            Challan
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                              generateReport(student);
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-xs"
                          >
                            <Download size={14} className="inline mr-1" />
                            Report
                          </button>
                        </td>
                      </tr>
                      {expandedStudent === student.id && (
                        <tr>
                          <td colSpan="10" className="px-6 py-4 bg-gray-50">
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-700 mb-2">Month-wise Dues Status</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                {student.duesByMonth.map((monthData, index) => (
                                  <div key={index} className={`p-2 rounded text-center ${monthData.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="text-sm font-medium">{monthData.month.substring(0, 3)}</div>
                                    <div className="text-xs">Rs. {monthData.due}</div>
                                    <div className="text-xs">{monthData.paid ? 'Paid' : 'Due'}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-gray-700 mb-2">Payment History</h3>
                              {student.paymentHistory.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Months Paid</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {student.paymentHistory.map((payment, index) => (
                                        <tr key={index}>
                                          <td className="px-4 py-2 whitespace-nowrap">{payment.date}</td>
                                          <td className="px-4 py-2 whitespace-nowrap">{payment.months.join(', ')}</td>
                                          <td className="px-4 py-2 whitespace-nowrap">Rs. {payment.amount}</td>
                                          <td className="px-4 py-2 whitespace-nowrap">{payment.mode}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500">No payment history available</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User size={48} className="mx-auto text-gray-400" />
                <p className="mt-2">No students found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Record Fee Payment</h2>
            
            <div className="mb-4">
              <p><span className="font-semibold">Student:</span> {selectedStudent.name}</p>
              <p><span className="font-semibold">Roll No:</span> {selectedStudent.rollNo}</p>
              <p><span className="font-semibold">Class:</span> {selectedStudent.class} - {selectedStudent.section}</p>
              <p><span className="font-semibold">Monthly Fee:</span> Rs. {selectedStudent.monthlyFee}</p>
              <p><span className="font-semibold">Total Dues:</span> Rs. {selectedStudent.dues}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Months to Pay</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                {selectedStudent.duesByMonth
                  .filter(month => !month.paid)
                  .map((monthData, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded text-center cursor-pointer ${paymentMonths.includes(monthData.month) ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'}`}
                      onClick={() => toggleMonthSelection(monthData.month)}
                    >
                      <div className="text-sm">{monthData.month.substring(0, 3)}</div>
                      <div className="text-xs">Rs. {monthData.due}</div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={selectedStudent.dues}
                min={selectedStudent.monthlyFee}
                readOnly={paymentMonths.length > 0}
              />
              <p className="text-xs text-gray-500 mt-1">Amount will be auto-calculated based on selected months</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMonths([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayment(selectedStudent)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesManagement;