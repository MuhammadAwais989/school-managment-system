import React, { useState } from 'react';
import Sidebar from "../sidebar/SideBar";
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
  ChevronUp,
  CreditCard,
  FileText,
  Edit,
  Plus,
  Minus,
  Info,
  Filter
} from 'react-feather';

const FeesManagement = () => {
  // Define all months for the academic year
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Monthly fee structure for different classes
  const monthlyFees = {
    'Nursery': 800,
    'KG-I A': 900,
    'KG-I B': 900,
    'KG-II A': 950,
    'KG-II B': 950,
    'One A': 1000,
    'One B': 1000,
    'Two A': 1050,
    'Two B': 1050,
    'Three A': 1100,
    'Three B': 1100,
    'Four A': 1150,
    'Four B': 1150,
    'Five A': 1200,
    'Five B': 1200,
    'Six A': 1300,
    'Six B': 1300,
    'Seven A': 1400,
    'Seven B': 1400,
    'Eight A': 1500,
    'Eight B': 1500,
    'Nine A': 1600,
    'Nine B': 1600,
    'Matric A': 1800,
    'Matric B': 1800
  };

  // Sample student data with month-wise dues and payments
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: 'S001',
      name: 'Ali Ahmed',
      fatherName: 'Ahmed Khan',
      class: 'Ten A',
      section: 'A',
      monthlyFee: 1700,
      totalFees: 17000,
      paidFees: 17000,
      status: 'Fully Paid',
      dues: 0,
      paymentHistory: [
        { date: '2023-09-15', amount: 8500, months: ['May', 'June', 'July', 'August', 'September'], mode: 'Cash' },
        { date: '2023-04-03', amount: 8500, months: ['January', 'February', 'March', 'April'], mode: 'Cash' }
      ],
      duesByMonth: [
        { month: 'January', due: 1700, paid: true },
        { month: 'February', due: 1700, paid: true },
        { month: 'March', due: 1700, paid: true },
        { month: 'April', due: 1700, paid: true },
        { month: 'May', due: 1700, paid: true },
        { month: 'June', due: 1700, paid: true },
        { month: 'July', due: 1700, paid: true },
        { month: 'August', due: 1700, paid: true },
        { month: 'September', due: 1700, paid: true },
        { month: 'October', due: 1700, paid: true },
        { month: 'November', due: 1700, paid: true },
        { month: 'December', due: 1700, paid: true }
      ]
    },
    {
      id: 2,
      rollNo: 'S002',
      name: 'Sara Khan',
      fatherName: 'Khalid Khan',
      class: 'Nine B',
      section: 'B',
      monthlyFee: 1600,
      totalFees: 16000,
      paidFees: 12000,
      status: 'Partially Paid',
      dues: 4000,
      paymentHistory: [
        { date: '2023-09-05', amount: 8000, months: ['May', 'June', 'July', 'August', 'September'], mode: 'Cash' },
        { date: '2023-04-03', amount: 4000, months: ['January', 'February', 'March'], mode: 'Cash' }
      ],
      duesByMonth: [
        { month: 'January', due: 1600, paid: true },
        { month: 'February', due: 1600, paid: true },
        { month: 'March', due: 1600, paid: true },
        { month: 'April', due: 1600, paid: false },
        { month: 'May', due: 1600, paid: true },
        { month: 'June', due: 1600, paid: true },
        { month: 'July', due: 1600, paid: true },
        { month: 'August', due: 1600, paid: true },
        { month: 'September', due: 1600, paid: true },
        { month: 'October', due: 1600, paid: false },
        { month: 'November', due: 1600, paid: false },
        { month: 'December', due: 1600, paid: false }
      ]
    },
    {
      id: 3,
      rollNo: 'N001',
      name: 'Fatima Noor',
      fatherName: 'Noor Muhammad',
      class: 'Nursery',
      section: 'A',
      monthlyFee: 800,
      totalFees: 8000,
      paidFees: 4800,
      status: 'Partially Paid',
      dues: 3200,
      paymentHistory: [
        { date: '2023-09-10', amount: 3200, months: ['June', 'July', 'August', 'September'], mode: 'Cash' }
      ],
      duesByMonth: [
        { month: 'January', due: 800, paid: true },
        { month: 'February', due: 800, paid: true },
        { month: 'March', due: 800, paid: true },
        { month: 'April', due: 800, paid: true },
        { month: 'May', due: 800, paid: true },
        { month: 'June', due: 800, paid: true },
        { month: 'July', due: 800, paid: true },
        { month: 'August', due: 800, paid: true },
        { month: 'September', due: 800, paid: true },
        { month: 'October', due: 800, paid: false },
        { month: 'November', due: 800, paid: false },
        { month: 'December', due: 800, paid: false }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMonths, setPaymentMonths] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('fees');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showChallan, setShowChallan] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [challanMonths, setChallanMonths] = useState([]);
  const [examinationFee, setExaminationFee] = useState(0);
  const [otherFees, setOtherFees] = useState([]);
  const [newFeeDescription, setNewFeeDescription] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  // Group students by class
  const groupStudentsByClass = (studentsList) => {
    const grouped = {};
    
    studentsList.forEach(student => {
      // Extract base class (without section)
      const baseClass = student.class.split(' ')[0];
      
      if (!grouped[baseClass]) {
        grouped[baseClass] = [];
      }
      grouped[baseClass].push(student);
    });
    
    return grouped;
  };

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

        // Check if all months are paid
        const allPaid = s.duesByMonth.every(month => month.paid) ||
          (newDues === 0 && paymentMonths.length === s.duesByMonth.filter(m => !m.paid).length);

        const newStatus = allPaid ? 'Fully Paid' : 'Partially Paid';

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
              date: paymentDate,
              amount: parseInt(paymentAmount),
              months: [...paymentMonths],
              mode: 'Cash'
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
      // Auto-calculate amount based on selected months
      if (selectedStudent) {
        const monthlyFee = selectedStudent.monthlyFee;
        setPaymentAmount((paymentMonths.length + 1) * monthlyFee);
      }
    }
  };

  // Generate challan
const generateChallan = (student, months = []) => {
  setChallanData(student);
  setChallanMonths(months); // Use the provided months array
  setExaminationFee(0);
  setOtherFees([]);
  setShowChallan(true);
};

  // Add a new fee to the challan
  const addNewFee = () => {
    if (newFeeDescription && newFeeAmount) {
      setOtherFees([...otherFees, { description: newFeeDescription, amount: parseInt(newFeeAmount) }]);
      setNewFeeDescription('');
      setNewFeeAmount('');
    }
  };

  // Remove a fee from the challan
  const removeFee = (index) => {
    const updatedFees = [...otherFees];
    updatedFees.splice(index, 1);
    setOtherFees(updatedFees);
  };

  // Calculate total challan amount
  const calculateChallanTotal = () => {
    const tuitionFee = challanData ? challanData.monthlyFee * challanMonths.length : 0;
    const examFee = examinationFee || 0;
    const otherFeesTotal = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
    return tuitionFee + examFee + otherFeesTotal;
  };

  // Print challan
  const printChallan = () => {
    window.print();
  };

  // Generate PDF for due list
  const generateDueListPDF = () => {
    // Group students by class
    const groupedStudents = groupStudentsByClass(filteredStudents.filter(s => s.dues > 0));
    
    // Create HTML content for PDF
    let content = `
      <html>
        <head>
          <title>Due List Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #2c5282; }
            h2 { color: #2c5282; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .due { color: #e53e3e; font-weight: bold; }
            .header { display: flex; justify-between; margin-bottom: 20px; }
            .logo { font-size: 20px; font-weight: bold; color: #2c5282; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 5px; }
            .class-section { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">City School System</div>
            <div>Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          <h1>Due List Report</h1>
          <div class="summary">
            <p><strong>Class:</strong> ${selectedClass === 'All' ? 'All Classes' : selectedClass}</p>
            <p><strong>Total Students with Dues:</strong> ${filteredStudents.filter(s => s.dues > 0).length}</p>
            <p><strong>Total Dues Amount:</strong> Rs. ${filteredStudents.reduce((sum, student) => sum + student.dues, 0)}</p>
          </div>
    `;

    // Add each class section
    Object.keys(groupedStudents).sort().forEach(className => {
      content += `
        <div class="class-section">
          <h2>${className}</h2>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Class/Section</th>
                <th>Due Months</th>
                <th>Due Amount</th>
              </tr>
            </thead>
            <tbody>
      `;

    // Add student rows for this class
    groupedStudents[className].forEach(student => {
      const dueMonths = student.duesByMonth
        .filter(month => !month.paid)
        .map(month => month.month)
        .join(', ');
        
      content += `
          <tr>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.fatherName}</td>
            <td>${student.class}</td>
            <td>${dueMonths}</td>
            <td class="due">Rs. ${student.dues}</td>
          </tr>
        `;
    });

    content += `
        </tbody>
      </table>
    </div>
    `;

    content += `
        </body>
      </html>
    `;

    // Create a new window and write the content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  });

  // Export data to Excel (XLS format)
  const exportToExcel = () => {
    // Group students by class
    const groupedStudents = groupStudentsByClass(filteredStudents);
    
    // Create HTML table content
    let tableContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        td { mso-number-format: "\\@"; }
        th { background-color: #E3F2FD; font-weight: bold; }
        .class-heading { background-color: #BBDEFB; font-weight: bold; }
        .due-months { background-color: #FFECB3; }
      </style>
    </head>
    <body>
    <h2>Fees Management Report - ${new Date().toLocaleDateString()}</h2>
    <table>
      <thead>
        <tr>
          <th>Class</th>
          <th>Roll No</th>
          <th>Name</th>
          <th>Father Name</th>
          <th>Section</th>
          <th>Total Fees</th>
          <th>Paid Fees</th>
          <th>Dues</th>
          <th>Due Months</th>
        </tr>
      </thead>
      <tbody>
    `;

    // Add each class section
    Object.keys(groupedStudents).sort().forEach(className => {
      tableContent += `
        <tr>
          <td colspan="10" class="class-heading">${className}</td>
        </tr>
      `;

      // Add student rows for this class
      groupedStudents[className].forEach(student => {
        const dueMonths = student.duesByMonth
          .filter(month => !month.paid)
          .map(month => month.month)
          .join(', ');

        // Extract section from class
        const section = student.class.split(' ')[1] || '';

        tableContent += `
          <tr>
            <td></td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.fatherName}</td>
            <td>${section}</td>
            <td>${student.totalFees}</td>
            <td>${student.paidFees}</td>
            <td>${student.dues}</td>
            <td class="due-months">${dueMonths || 'None'}</td>
          </tr>
        `;
      });

      tableContent += `
        </tbody>
      </table>
    `;
    });

    tableContent += `
      </body>
    </html>
  `;

    // Create download link
    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split('T')[0];

    link.setAttribute("href", url);
    link.setAttribute("download", `fees_report_${date}.xls`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // State for details modal student
  const [detailsStudent, setDetailsStudent] = useState(null);

  // Show student details
  const showStudentDetails = (student) => {
    setDetailsStudent(student);
    setShowDetailsModal(true);
  };

  // Calculate summary data
  const totalStudents = students.length;
  const totalFeesCollection = students.reduce((sum, student) => sum + student.paidFees, 0);
  const totalDues = students.reduce((sum, student) => sum + student.dues, 0);
  const fullyPaidStudents = students.filter(student => student.status === 'Fully Paid').length;

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-0">

        {/* Main Content */}
        <div className="lg:pl-[90px] pt-14 pr-2 pb-2 pr-2 bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-screen shadow-md rounded-md px-0  overflow-hidden">

            {/* Main content */}
            <main className="flex-1 overflow-y-auto md:p-4 bg-gray-50 w-full min-h-screen">
              <div className=" flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-0">
                <div className="flex items-center">
                  <DollarSign className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
                </div>
                
                {/* Search Bar and Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 w-full md:w-[70%]">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, roll no, father name..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFilterModal(true)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center"
                    >
                      <Filter size={16} className="mr-1" />
                      Filter
                    </button>
                    <button
                      onClick={generateDueListPDF}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                    >
                      <FileText size={16} className="mr-1" />
                      Due List
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                    >
                      <Download size={16} className="mr-1" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6 ml-8 px-4 md:px-0">Manage student fees</p>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 md:px-0">
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

              {/* Students Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2 md:mx-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Roll No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Father Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Class/Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Total Fees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Dues</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{student.rollNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{student.fatherName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                          <td className="px-6 py-4 whitespace-nowrap">Rs. {student.totalFees}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => showStudentDetails(student)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md mr-2 text-xs"
                            >
                              <Info size={14} className="inline mr-1" />
                              Details
                            </button>
                            <button
                              onClick={() => {
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
                              onClick={() => {
                                const latestPayment = selectedStudent.paymentHistory.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];
    
    // Generate challan with the months from the latest payment
    generateChallan(selectedStudent, latestPayment.months);
  }}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              <Printer size={14} className="inline mr-1" />
                              Challan
                            </button>
                          </td>
                        </tr>
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
        </div>
      </div>
    </>
  );
}};

export default FeesManagement;