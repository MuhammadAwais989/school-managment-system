import React, { useState, useEffect } from 'react';
import Sidebar from "../sidebar/SideBar"
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import {
  Search,
  Download,
  Printer,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  Filter,
  X,
  Plus,
  Minus,
  Info,
  ChevronLeft,
  ChevronRight,
  Hash
} from 'react-feather';
import Loading from '../Loading';

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

  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMonths, setPaymentMonths] = useState([]);
  const [showChallan, setShowChallan] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [challanMonths, setChallanMonths] = useState([]);
  const [examinationFee, setExaminationFee] = useState(0);
  const [otherFees, setOtherFees] = useState([]);
  const [newFeeDescription, setNewFeeDescription] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch students data from API using axios
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseURL}/students/details`);
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error('API response is not an array of students');
        }

        // Transform API data
        const transformedStudents = data.map((student, index) => {
          const monthlyFee = monthlyFees[student.class] || 1000;
          const totalFees = monthlyFee * 10;
          const paidFees = Math.floor(Math.random() * totalFees);
          const dues = totalFees - paidFees;
          const status = dues === 0 ? 'Fully Paid' : dues === totalFees ? 'Not Paid' : 'Partially Paid';

          const duesByMonth = allMonths.map(month => ({
            month,
            due: monthlyFee,
            paid: Math.random() > 0.3
          }));

          const paymentHistory = duesByMonth
            .filter(month => month.paid)
            .map(month => ({
              date: new Date().toISOString().split('T')[0],
              amount: monthlyFee,
              months: [month.month],
              mode: 'Cash'
            }));

          return {
            id: student._id || student.id || index + 1,
            rollNo: student.rollNumber || student.rollNo || `S${(index + 1).toString().padStart(3, '0')}`,
            name: student.name || 'Unknown Student',
            fatherName: student.fatherName || 'Unknown Father',
            class: student.Class || 'Not Assigned',
            section: student.section || 'Not Assigned',
            Fees: student.Fees || 'Not Assigned',
            monthlyFee,
            totalFees,
            paidFees,
            status,
            dues,
            paymentHistory,
            duesByMonth
          };
        });

        setStudents(transformedStudents);
        setLoading(false);
        setError(null);

      } catch (err) {
        console.error('Error fetching students:', err);

        const errorMessage = err.response
          ? `Server Error: ${err.response.status}`
          : err.request
            ? 'Network Error: Unable to reach the server'
            : err.message || 'An unexpected error occurred';

        setError(errorMessage);
        setLoading(false);

        // Fallback to sample data

      }
    };

    fetchStudents();
  }, []);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers for pagination with better logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust if we're near the beginning
      if (currentPage <= halfVisible + 1) {
        endPage = maxVisiblePages - 1;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 2;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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
        const newStatus = newDues === 0 ? 'Fully Paid' : 'Partially Paid';

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
      if (selectedStudent) {
        const monthlyFee = selectedStudent.monthlyFee;
        setPaymentAmount((paymentMonths.length + 1) * monthlyFee);
      }
    }
  };

  // Generate challan
  const generateChallan = (student, months = []) => {
    setChallanData(student);
    setChallanMonths(months);
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
    const dueStudents = filteredStudents.filter(s => s.dues > 0);

    let content = `
      <html>
        <head>
          <title>Due List Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #2c5282; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .due { color: #e53e3e; font-weight: bold; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Due List Report</h1>
          <div class="summary">
            <p><strong>Total Students with Dues:</strong> ${dueStudents.length}</p>
            <p><strong>Total Dues Amount:</strong> Rs. ${dueStudents.reduce((sum, student) => sum + student.dues, 0)}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Due Amount</th>
              </tr>
            </thead>
            <tbody>
    `;

    dueStudents.forEach(student => {
      content += `
        <tr>
          <td>${student.rollNo}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td class="due">Rs. ${student.dues}</td>
        </tr>
      `;
    });

    content += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Export data to Excel
  const exportToExcel = () => {
    let tableContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        td { mso-number-format: "\\@"; }
        th { background-color: #E3F2FD; font-weight: bold; }
      </style>
    </head>
    <body>
    <h2>Fees Management Report - ${new Date().toLocaleDateString()}</h2>
    <table>
      <thead>
        <tr>
          <th>Roll No</th>
          <th>Name</th>
          <th>Father Name</th>
          <th>Class</th>
          <th>Total Fees</th>
          <th>Paid Fees</th>
          <th>Dues</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

    filteredStudents.forEach(student => {
      tableContent += `
        <tr>
          <td>${student.rollNo}</td>
          <td>${student.name}</td>
          <td>${student.fatherName}</td>
          <td>${student.class}</td>
          <td>${student.totalFees}</td>
          <td>${student.paidFees}</td>
          <td>${student.dues}</td>
          <td>${student.status}</td>
        </tr>
      `;
    });

    tableContent += `
      </tbody>
    </table>
    </body>
    </html>
  `;

    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fees_report_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    if (status === 'Fully Paid') {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (status === 'Partially Paid') {
      return <AlertCircle size={16} className="text-yellow-500" />;
    } else {
      return <XCircle size={16} className="text-red-500" />;
    }
  };

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

  if (loading) {
    return <Loading text='Loading Student Fees Record' />;
  }

  return (
    <>
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-0">
        <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-screen shadow-md rounded-md px-0 overflow-hidden">

            <main className="flex-1 overflow-y-auto md:p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-0">
                <div className="flex items-center">
                  <DollarSign className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
                </div>

                <div className="flex flex-col md:flex-row gap-2 w-full md:w-[70%]">
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
      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Roll No</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Student Name</th>
      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Father Name</th>
      <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Class/Section</th>
      <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Total Fees</th>
      <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Dues</th>
      <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
      <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {currentStudents.map((student) => (
      <tr key={student.id} className="hover:bg-gray-50">
        {/* Roll Number */}
        <td className="px-4 py-3 align-middle">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <Hash size={12} className="text-blue-600" />
              </div>
            </div>
            <div>
              <div className="font-mono font-semibold text-gray-900 text-sm">{student.rollNo}</div>
            </div>
          </div>
        </td>

        {/* Student Info */}
        <td className="px-4 py-3 align-middle">
          <div>
            <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
          </div>
        </td>
        
        <td className="px-4 py-3 align-middle">
          <div>
            <div className="font-semibold text-gray-900 text-sm">{student.fatherName}</div>
          </div>
        </td>

        {/* Class/Section */}
        <td className="px-4 py-3 align-middle text-center">
          <div className="inline-flex flex-col items-center justify-center">
            <span className="font-bold text-gray-900 text-sm">{student.class}</span>
            <span className="text-xs text-gray-500">Section {student.section}</span>
          </div>
        </td>

        {/* Financial */}
        <td className="px-4 py-3 align-middle text-right">
          <div className="space-y-1">
            <div className="font-bold text-gray-900 text-sm">Rs. {student.Fees.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </td>

        {/* Dues */}
        <td className="px-4 py-3 align-middle text-right">
          <div className={`space-y-1 ${student.dues > 0 ? 'text-red-600' : 'text-green-600'}`}>
            <div className="font-bold text-sm">Rs. {student.dues.toLocaleString()}</div>
            <div className="text-xs font-medium">
              {student.dues > 0 ? 'Due' : 'Clear'}
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3 align-middle text-center">
          <div className="flex justify-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full ${student.status === 'Fully Paid' ? 'bg-green-100 text-green-800' :
                student.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${student.status === 'Fully Paid' ? 'bg-green-500' :
                  student.status === 'Partially Paid' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              <span className="text-xs font-semibold">{student.status}</span>
            </div>
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 align-middle">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => showStudentDetails(student)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Info size={14} className="mr-1" />
              Details
            </button>
            <button
              onClick={() => {
                setSelectedStudent(student);
                setShowPaymentModal(true);
              }}
              disabled={student.dues === 0}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors ${student.dues === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              <DollarSign size={14} className="mr-1" />
              Pay
            </button>
            <button
              onClick={() => {
                setSelectedStudent(student);
                generateChallan(student, allMonths.slice(0, 5));
              }}
              className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
            >
              <Printer size={14} className="mr-1" />
              Challan
            </button>
          </div>
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

                {filteredStudents.length > 0 && !loading && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-white">
                    {/* Showing entries info */}
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredStudents.length}</span> students
                    </div>

                    {/* Items Per Page Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="text-sm text-gray-700">entries per page</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        title="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {getPageNumbers().map((pageNumber, index) => (
                          <button
                            key={index}
                            onClick={() => typeof pageNumber === 'number' && setCurrentPage(pageNumber)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === pageNumber
                              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                              : pageNumber === '...'
                                ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            disabled={pageNumber === '...'}
                            title={typeof pageNumber === 'number' ? `Go to page ${pageNumber}` : ''}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        title="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}              </div>
            </main>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Record Fee Payment</h2>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentMonths([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Student</p>
                      <p className="font-semibold">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Roll No</p>
                      <p className="font-semibold">{selectedStudent.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Class</p>
                      <p className="font-semibold">{selectedStudent.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Monthly Fee</p>
                      <p className="font-semibold">Rs. {selectedStudent.monthlyFee}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-blue-700 font-medium">Total Dues</p>
                      <p className="font-semibold text-red-600">Rs. {selectedStudent.dues}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Months to Pay</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                    {selectedStudent.duesByMonth
                      .filter(month => !month.paid)
                      .map((monthData, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-center cursor-pointer transition-all ${paymentMonths.includes(monthData.month) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => toggleMonthSelection(monthData.month)}
                        >
                          <div className="text-sm font-medium">{monthData.month.substring(0, 3)}</div>
                          <div className="text-xs">Rs. {monthData.due}</div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={selectedStudent.dues}
                    min={selectedStudent.monthlyFee}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentMonths([]);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePayment(selectedStudent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Student Details Modal */}
          {showDetailsModal && detailsStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Student</p>
                      <p className="font-semibold">{detailsStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Roll No</p>
                      <p className="font-semibold">{detailsStudent.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Father Name</p>
                      <p className="font-semibold">{detailsStudent.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Class</p>
                      <p className="font-semibold">{detailsStudent.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Total Fees</p>
                      <p className="font-semibold">Rs. {detailsStudent.Fees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Dues</p>
                      <p className="font-semibold text-red-600">Rs. {detailsStudent.dues}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Month-wise Dues Status</h3>
                  <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                    {detailsStudent.duesByMonth.map((monthData, index) => (
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
                  {detailsStudent.paymentHistory.length > 0 ? (
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
                          {detailsStudent.paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{payment.date}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{payment.months.join(', ')}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">Rs. {payment.amount}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{payment.mode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment history available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Challan Modal */}
          {showChallan && challanData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Fee Challan</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={printChallan}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Printer size={14} className="mr-1" />
                      Print
                    </button>
                    <button
                      onClick={() => setShowChallan(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-800">City School System</h1>
                    <p className="text-sm text-gray-600">123 Education Street, Karachi, Pakistan</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
                      <p className="text-sm"><span className="font-medium">Name:</span> {challanData.name}</p>
                      <p className="text-sm"><span className="font-medium">Father Name:</span> {challanData.fatherName}</p>
                      <p className="text-sm"><span className="font-medium">Roll No:</span> {challanData.rollNo}</p>
                      <p className="text-sm"><span className="font-medium">Class:</span> {challanData.class}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Challan Information</h3>
                      <p className="text-sm"><span className="font-medium">Challan No:</span> CH-{challanData.rollNo}-2023</p>
                      <p className="text-sm"><span className="font-medium">Issue Date:</span> {new Date().toLocaleDateString()}</p>
                      <p className="text-sm"><span className="font-medium">Due Date:</span> {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Fee Details</h3>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left text-sm">Description</th>
                          <th className="border border-gray-300 p-2 text-right text-sm">Amount (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 text-sm">Tuition Fee ({challanMonths.join(', ')})</td>
                          <td className="border border-gray-300 p-2 text-sm text-right">{challanData.monthlyFee * challanMonths.length}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2 text-sm">
                            <input
                              type="text"
                              placeholder="Examination Fee"
                              className="w-full p-1 border-none focus:outline-none"
                              value={examinationFee > 0 ? "Examination Fee" : ""}
                              onChange={(e) => setExaminationFee(e.target.value ? parseInt(e.target.value) : 0)}
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-sm text-right">
                            <input
                              type="number"
                              placeholder="0"
                              className="w-16 p-1 border-none text-right focus:outline-none"
                              value={examinationFee || ""}
                              onChange={(e) => setExaminationFee(e.target.value ? parseInt(e.target.value) : 0)}
                            />
                          </td>
                        </tr>
                        {otherFees.map((fee, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span>{fee.description}</span>
                                <button
                                  onClick={() => removeFee(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Minus size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="border border-gray-300 p-2 text-sm text-right">{fee.amount}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border border-gray-300 p-2 text-sm">
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Fee Description"
                                className="flex-1 p-1 border-none focus:outline-none"
                                value={newFeeDescription}
                                onChange={(e) => setNewFeeDescription(e.target.value)}
                              />
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-sm text-right">
                            <div className="flex items-center justify-end">
                              <input
                                type="number"
                                placeholder="Amount"
                                className="w-16 p-1 border-none text-right focus:outline-none"
                                value={newFeeAmount}
                                onChange={(e) => setNewFeeAmount(e.target.value)}
                              />
                              <button
                                onClick={addNewFee}
                                className="ml-2 text-green-500 hover:text-green-700"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="border border-gray-300 p-2 text-sm font-semibold">Total Amount</td>
                          <td className="border border-gray-300 p-2 text-sm text-right font-semibold">{calculateChallanTotal()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Filter Students</h2>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name, roll no, father name..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="All">All Classes</option>
                    {[...new Set(students.map(student => student.class))].sort().map(className => (
                      <option key={className} value={className}>{className}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
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

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedClass('All');
                      setSelectedStatus('All');
                      setSearchTerm('');
                      setShowFilterModal(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeesManagement;