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
  const [paymentMode, setPaymentMode] = useState('Cash');
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
  // Existing states ke saath yeh add karein
  const [totalFeesCollection, setTotalFeesCollection] = useState(0);
  const [totalDues, setTotalDues] = useState(0);
  const [fullyPaidStudents, setFullyPaidStudents] = useState(0);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fetch students data from backend API
  const fetchStudents = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      // Use COMBINED API that gets students from main API + fees from separate system
      const response = await axios.get(`${BaseURL}/fees/combined`);
      const data = response.data;
      console.log('Combined students + fees data:', data.students[0]);

      // Role-based filtering
      const role = localStorage.getItem("role");
      let filteredStudents = data.students;

      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        filteredStudents = data.students.filter(student =>
          student.Class === assignedClass &&
          student.section === assignedSection
        );
      }

      // Client-side pagination and filtering
      let resultStudents = filteredStudents;

      // Search filter
      if (searchTerm) {
        resultStudents = resultStudents.filter(student =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Class filter - Use 'Class' (capital C) from main data
      if (selectedClass !== 'All') {
        resultStudents = resultStudents.filter(student =>
          student.Class === selectedClass
        );
      }

      // Status filter - Use actual status from fees system
      if (selectedStatus !== 'All') {
        resultStudents = resultStudents.filter(student =>
          student.status === selectedStatus
        );
      }

      // ✅ YEH NAYA CODE ADD KAREIN - TOTAL CALCULATIONS
      // Sabhi filtered students ki total fees calculate karein
      const allStudentsTotalFees = resultStudents.reduce((sum, student) => sum + (student.paidFees || 0), 0);
      const allStudentsTotalDues = resultStudents.reduce((sum, student) => sum + (student.dues || 0), 0);
      const allStudentsFullyPaid = resultStudents.filter(student => student.status === 'Fully Paid').length;

      // Total values set karein
      setTotalFeesCollection(allStudentsTotalFees);
      setTotalDues(allStudentsTotalDues);
      setFullyPaidStudents(allStudentsFullyPaid);

      // Use ACTUAL data from combined system - NO NEED FOR MANUAL CALCULATIONS
      resultStudents = resultStudents.map(student => ({
        ...student,
        // Data already comes prepared from combined API
        class: student.Class, // Use Class from main data
        section: student.section
      }));

      // Pagination calculation
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStudents = resultStudents.slice(startIndex, endIndex);

      setStudents(paginatedStudents);
      setTotalPages(Math.ceil(resultStudents.length / limit));
      setTotalStudents(resultStudents.length);
      setError(null);

    } catch (err) {
      console.error('Error fetching combined data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch students data';
      setError(errorMessage);
      setStudents([]);
      setTotalPages(1);
      setTotalStudents(0);
      // Error case mein bhi totals reset karein
      setTotalFeesCollection(0);
      setTotalDues(0);
      setFullyPaidStudents(0);
    } finally {
      setLoading(false);
    }
  };


  // Fetch student details
  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(`${BaseURL}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);

      // Check if it's a 404 error (endpoint not found)
      if (error.response?.status === 404) {
        console.log('Student details endpoint not found, using fallback data');
        // Return null to indicate we should use fallback data
        return null;
      }

      throw error;
    }
  };

  // Show student details 
  const showStudentDetails = async (student) => {
    try {
      console.log('Student payment history:', student.paymentHistory);

      // Use the student data with actual payment history
      const studentDetails = {
        ...student,
        // Use actual payment history if available, otherwise empty array
        paymentHistory: student.paymentHistory || []
      };

      setDetailsStudent(studentDetails);
      setShowDetailsModal(true);

    } catch (error) {
      console.error('Error in showStudentDetails:', error);

      // Fallback with empty payment history
      setDetailsStudent({
        ...student,
        paymentHistory: []
      });
      setShowDetailsModal(true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStudents(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Fetch data when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchStudents(1, itemsPerPage);
  }, [searchTerm, selectedClass, selectedStatus]);

  // Handle fee payment
  const handlePayment = async (student) => {
    if (!paymentAmount || paymentAmount <= 0 || paymentAmount > student.dues) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (paymentMonths.length === 0) {
      alert('Please select at least one month for payment');
      return;
    }

    try {
      const studentId = student._id;

      // Prepare payment data
      const paymentData = {
        amount: parseInt(paymentAmount),
        months: paymentMonths,
        paymentDate: paymentDate,
        mode: paymentMode
      };

      console.log('Sending payment to SEPARATE fees system...');

      // Use SEPARATE fees system API
      const response = await axios.post(`${BaseURL}/fees/${studentId}/payment`, paymentData);

      if (response.data.success) {
        console.log('✅ Payment Recorded in SEPARATE System!');

        // Refresh data from combined API
        await fetchStudents(currentPage, itemsPerPage);

        // Close modal and reset
        setShowPaymentModal(false);
        setPaymentAmount('');
        setPaymentMonths([]);
        setPaymentMode('Cash');
      }

    } catch (error) {
      console.error('Payment error:', error);

      // Detailed error message
      let errorMessage = 'Payment failed. Please try again.';

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server response:', error.response.data);

        // Specific handling for "Student not found" error
        if (error.response.data?.message === 'Student not found') {
          errorMessage = 'Student not found in database. Please check if student exists.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message;
      }

      alert(`❌ ${errorMessage}`);
    }
  };

  // Generate challan
// Generate challan with last payment data
const generateChallan = async (student, months = []) => {
  try {
    console.log('🔄 Generating challan with last payment data for:', student.name);
    
    // Get last payment details
    const lastPayment = student.paymentHistory && student.paymentHistory.length > 0 
      ? student.paymentHistory[student.paymentHistory.length - 1]
      : null;

    console.log('📋 Last payment:', lastPayment);

    if (!lastPayment) {
      alert('No payment history found for this student. Please make a payment first.');
      return;
    }

    // Use last payment months and amount
    const paymentMonths = lastPayment.months || [];
    const paymentAmount = lastPayment.amount || 0;
    const paymentDate = lastPayment.date ? new Date(lastPayment.date) : new Date();
    const paymentMode = lastPayment.mode || 'Cash';

    // Calculate fees breakdown based on last payment
    const monthlyFee = student.monthlyFee || Number(student.Fees) || 0;
    const tuitionFee = paymentAmount; // Use actual paid amount
    
    const totalAmount = tuitionFee + examinationFee + 
      otherFees.reduce((sum, fee) => sum + fee.amount, 0);

    // Create challan data based on last payment
    const challanData = {
      student: {
        name: student.name,
        fatherName: student.fatherName,
        rollNo: student.rollNo,
        class: student.class || student.Class,
        section: student.section
      },
      challanNo: `CH-${student.rollNo}-${Date.now()}`,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      months: paymentMonths, // Use months from last payment
      paymentDate: paymentDate.toISOString(),
      paymentMode: paymentMode,
      academicYear: '2024-2025',
      feeBreakdown: {
        tuitionFee: tuitionFee,
        examinationFee: examinationFee,
        otherFees: otherFees,
        totalAmount: totalAmount,
        paidAmount: paymentAmount // Show paid amount
      },
      lastPayment: lastPayment // Include full last payment details
    };

    console.log('✅ Challan generated with last payment data:', challanData);
    
    setChallanData(challanData);
    setChallanMonths(paymentMonths); // Set months from last payment
    setShowChallan(true);
    
  } catch (error) {
    console.error('❌ Error generating challan:', error);
    alert('Failed to generate challan. Please try again.');
  }
};

  // Get due list
  const getDueList = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedClass !== 'All') {
        params.append('class', selectedClass);
      }

      const response = await axios.get(`${BaseURL}/students/dues/list?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching due list:', error);
      throw error;
    }
  };

  // Generate PDF for due list
  const generateDueListPDF = async () => {
    try {
      const dueData = await getDueList();

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
              <p><strong>Total Students with Dues:</strong> ${dueData.dueStudents?.length || 0}</p>
              <p><strong>Total Dues Amount:</strong> Rs. ${dueData.totalDues || 0}</p>
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

      (dueData.dueStudents || []).forEach(student => {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate due list PDF');
    }
  };

  // Export data to Excel
  const exportToExcel = async () => {
    try {
      const response = await axios.get(`${BaseURL}/students/details`);
      let studentsData = response.data;

      // Role-based filtering for export
      const role = localStorage.getItem("role");
      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        studentsData = studentsData.filter(student =>
          student.Class === assignedClass &&
          student.section === assignedSection
        );
      }

      // Apply filters for export
      if (searchTerm) {
        studentsData = studentsData.filter(student =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedClass !== 'All') {
        studentsData = studentsData.filter(student =>
          student.class === selectedClass
        );
      }

      if (selectedStatus !== 'All') {
        studentsData = studentsData.filter(student =>
          student.status === selectedStatus
        );
      }

      // Calculate summary data for export
      const totalFeesCollection = students.reduce((sum, student) => sum + (student.paidFees || 0), 0);
      const totalDues = studentsData.reduce((sum, student) => sum + (student.dues || 0), 0);
      const fullyPaidCount = studentsData.filter(student => student.status === 'Fully Paid').length;
      const partiallyPaidCount = studentsData.filter(student => student.status === 'Partially Paid').length;
      const notPaidCount = studentsData.filter(student => student.status === 'Not Paid').length;

      let tableContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <title>Fees Management Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .summary { margin: 20px 0; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; }
        .summary h3 { margin-top: 0; color: #2d3748; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 10px; }
        .summary-item { padding: 10px; background: white; border-radius: 5px; border: 1px solid #e2e8f0; }
        .summary-value { font-size: 18px; font-weight: bold; color: #2d3748; }
        .summary-label { font-size: 12px; color: #718096; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background-color: #E3F2FD; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #ddd; }
        td { padding: 8px 10px; border: 1px solid #ddd; mso-number-format: "\\@"; }
        .fully-paid { color: #059669; }
        .partially-paid { color: #d97706; }
        .not-paid { color: #dc2626; }
        .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Fees Management Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="summary">
        <h3>Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${studentsData.length}</div>
            <div class="summary-label">Total Students</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">Rs. ${totalFeesCollection.toLocaleString()}</div>
            <div class="summary-label">Total Collected</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">Rs. ${totalDues.toLocaleString()}</div>
            <div class="summary-label">Total Dues</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${fullyPaidCount}</div>
            <div class="summary-label">Fully Paid</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${partiallyPaidCount}</div>
            <div class="summary-label">Partially Paid</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${notPaidCount}</div>
            <div class="summary-label">Not Paid</div>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Father Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Monthly Fee</th>
            <th>Total Fees</th>
            <th>Paid Fees</th>
            <th>Dues</th>
            <th>Status</th>
            <th>Last Payment Date</th>
          </tr>
        </thead>
        <tbody>
    `;

      studentsData.forEach(student => {
        const statusClass =
          student.status === 'Fully Paid' ? 'fully-paid' :
            student.status === 'Partially Paid' ? 'partially-paid' : 'not-paid';

        // Find last payment date
        let lastPaymentDate = 'N/A';
        if (student.paymentHistory && student.paymentHistory.length > 0) {
          const lastPayment = student.paymentHistory[student.paymentHistory.length - 1];
          lastPaymentDate = new Date(lastPayment.date).toLocaleDateString();
        }

        tableContent += `
          <tr>
            <td>${student.rollNo || 'N/A'}</td>
            <td>${student.name || 'N/A'}</td>
            <td>${student.fatherName || 'N/A'}</td>
            <td>${student.class || 'N/A'}</td>
            <td>${student.section || 'N/A'}</td>
            <td>${student.monthlyFee ? 'Rs. ' + student.monthlyFee.toLocaleString() : 'N/A'}</td>
            <td>${student.Fees ? 'Rs. ' + student.Fees.toLocaleString() : 'N/A'}</td>
            <td>${student.paidFees ? 'Rs. ' + student.paidFees.toLocaleString() : 'Rs. 0'}</td>
            <td>${student.dues ? 'Rs. ' + student.dues.toLocaleString() : 'Rs. 0'}</td>
            <td class="${statusClass}">${student.status || 'Not Paid'}</td>
            <td>${lastPaymentDate}</td>
          </tr>
      `;
      });

      tableContent += `
        </tbody>
      </table>

      <div class="footer">
        <p>Generated by School Management System | ${studentsData.length} records exported</p>
        <p>Filters Applied: 
          ${searchTerm ? 'Search: ' + searchTerm + ' | ' : ''}
          ${selectedClass !== 'All' ? 'Class: ' + selectedClass + ' | ' : ''}
          ${selectedStatus !== 'All' ? 'Status: ' + selectedStatus : 'All Statuses'}
        </p>
      </div>
    </body>
    </html>
    `;

      // Create and download Excel file
      const blob = new Blob([tableContent], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `fees_report_${timestamp}.xls`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data to Excel. Please try again.');
    }
  };

  // Toggle month selection for payment
  const toggleMonthSelection = (month) => {
    if (paymentMonths.includes(month)) {
      setPaymentMonths(paymentMonths.filter(m => m !== month));
    } else {
      setPaymentMonths([...paymentMonths, month]);
      if (selectedStudent) {
        const monthlyFee = selectedStudent.monthlyFee || 0;
        setPaymentAmount((paymentMonths.length + 1) * monthlyFee);
      }
    }
  };

  // Add a new fee to the challan
  const addNewFee = () => {
    if (newFeeDescription && newFeeAmount) {
      setOtherFees([...otherFees, {
        description: newFeeDescription,
        amount: parseInt(newFeeAmount)
      }]);
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
    const tuitionFee = challanData?.feeBreakdown?.tuitionFee ||
      (challanData?.student?.monthlyFee || 0) * challanMonths.length;
    const examFee = examinationFee || 0;
    const otherFeesTotal = otherFees.reduce((sum, fee) => sum + fee.amount, 0);
    return tuitionFee + examFee + otherFeesTotal;
  };

  // Print challan
  const printChallan = () => {
    window.print();
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


  // // Calculate summary data
  // const totalFeesCollection = students.reduce((sum, student) => sum + (student.paidFees || 0), 0);
  // const totalDues = students.reduce((sum, student) => sum + (student.dues || 0), 0);
  // const fullyPaidStudents = students.filter(student => student.status === 'Fully Paid').length;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      if (currentPage <= halfVisible + 1) {
        endPage = maxVisiblePages - 1;
      }
      if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 2;
      }
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
              {/* Header Section */}
              <div className="bg-gradient-to-r from-white to-blue-50/30 rounded-3xl p-6 mb-3 border border-blue-100/50 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                  {/* Page Title Section */}
                  <div className="flex items-center">
                    <div className="relative group">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mr-4 transform group-hover:scale-105 transition-transform duration-300">
                        <DollarSign className="text-white" size={26} />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                        Fees Management
                      </h1>
                    </div>
                  </div>

                  {/* Search and Actions Section */}
                  <div className="flex flex-col lg:flex-row gap-4 flex-1 lg:max-w-2xl">

                    {/* Enhanced Search Bar */}
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search students by name, roll number, or father's name..."
                        className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowFilterModal(true)}
                        className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-200 group min-w-[60px] sm:min-w-[120px] justify-center"
                      >
                        <Filter size={18} className="sm:mr-3 text-gray-500 group-hover:text-blue-600" />
                        <span className="hidden sm:inline font-semibold">Filter</span>
                        <span className="sm:hidden sr-only">Filter</span>
                      </button>

                      <button
                        onClick={generateDueListPDF}
                        className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg min-w-[60px] sm:min-w-[140px] justify-center"
                      >
                        <FileText size={18} className="sm:mr-3" />
                        <span className="hidden sm:inline font-semibold">Due List</span>
                        <span className="sm:hidden sr-only">Due List</span>
                      </button>

                      <button
                        onClick={exportToExcel}
                        className="flex items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg min-w-[60px] sm:min-w-[120px] justify-center"
                      >
                        <Download size={18} className="sm:mr-3" />
                        <span className="hidden sm:inline font-semibold">Export</span>
                        <span className="sm:hidden sr-only">Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Summary Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {/* Total Students Card */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600/80 text-sm font-semibold uppercase tracking-wide mb-2">Total Students</p>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{totalStudents.toLocaleString()}</h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="text-white" size={28} />
                    </div>
                  </div>
                </div>

                {/* Fees Collected Card */}
                <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600/80 text-sm font-semibold uppercase tracking-wide mb-2">Fees Collected</p>
                      {/* ✅ YAHAN DIRECT STATE USE KAREIN */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">Rs. {totalFeesCollection.toLocaleString()}</h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="text-white" size={28} />
                    </div>
                  </div>
                </div>

                {/* Total Dues Card */}
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600/80 text-sm font-semibold uppercase tracking-wide mb-2">Total Dues</p>
                      {/* ✅ YAHAN DIRECT STATE USE KAREIN */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">Rs. {totalDues.toLocaleString()}</h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <AlertCircle className="text-white" size={28} />
                    </div>
                  </div>
                </div>

                {/* Fully Paid Card */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600/80 text-sm font-semibold uppercase tracking-wide mb-2">Fully Paid</p>
                      {/* ✅ YAHAN DIRECT STATE USE KAREIN */}
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{fullyPaidStudents.toLocaleString()}</h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="text-white" size={28} />
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
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
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

                          <td className="px-4 py-3 align-middle">
                            <div className="font-semibold text-gray-900 text-sm">{student.name}</div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="font-semibold text-gray-900 text-sm">{student.fatherName}</div>
                          </td>

                          <td className="px-4 py-3 align-middle text-center">
                            <div className="inline-flex flex-col items-center justify-center">
                              <span className="font-bold text-gray-900 text-sm">{student.class}</span>
                              <span className="text-xs text-gray-500">Section {student.section}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-right">
                            <div className="space-y-1">
                              <div className="font-bold text-gray-900 text-sm">Rs. {student.Fees?.toLocaleString()}</div>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-right">
                            <div className={`space-y-1 ${student.dues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              <div className="font-bold text-sm">Rs. {student.dues?.toLocaleString()}</div>
                              <div className="text-xs font-medium">
                                {student.dues > 0 ? 'Due' : 'Clear'}
                              </div>
                            </div>
                          </td>

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

                {students.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <User size={48} className="mx-auto text-gray-400" />
                    <p className="mt-2">No students found matching your criteria</p>
                  </div>
                )}

                {students.length > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-white">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalStudents)}
                      </span>{' '}
                      of <span className="font-medium">{totalStudents}</span> students
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="text-sm text-gray-700">entries</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {getPageNumbers().map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() => typeof pageNumber === 'number' && setCurrentPage(pageNumber)}
                          disabled={pageNumber === '...'}
                          className={`min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === pageNumber
                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                            : pageNumber === '...'
                              ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Months to Pay</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                    {selectedStudent.duesByMonth
                      ?.filter(month => !month.paid && month.dueAmount > 0)
                      .map((monthData, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-center cursor-pointer transition-all ${paymentMonths.includes(monthData.month) ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          onClick={() => toggleMonthSelection(monthData.month)}
                        >
                          <div className="text-sm font-medium">{monthData.month}</div>
                          <div className="text-xs">Rs. {monthData.dueAmount}</div>
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
                      <p className="text-sm text-blue-700 font-medium">Class & Section</p>
                      <p className="font-semibold">{detailsStudent.Class} - {detailsStudent.section}</p>
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
                    {detailsStudent.duesByMonth?.map((monthData, index) => (
                      <div key={index} className={`p-2 rounded text-center ${monthData.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <div className="text-sm font-medium">{monthData.month}</div>
                        <div className="text-xs">Rs. {monthData.dueAmount}</div>
                        <div className="text-xs">{monthData.paid ? 'Paid' : 'Due'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Payment History</h3>
                  {detailsStudent.paymentHistory && detailsStudent.paymentHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Months Paid</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Receipt No</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {detailsStudent.paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {new Date(payment.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {payment.months ? payment.months.join(', ') : 'N/A'}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">Rs. {payment.amount}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{payment.mode || 'Cash'}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{payment.receiptNo || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <DollarSign size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 text-lg">No Payment History</p>
                      <p className="text-gray-400 text-sm">This student hasn't made any payments yet.</p>
                    </div>
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
        <h2 className="text-xl font-bold text-gray-800">Fee Challan (Last Payment)</h2>
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
            className="text-gray-400 hover:text-gray-600"
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
            <p className="text-sm"><span className="font-medium">Name:</span> {challanData.student?.name}</p>
            <p className="text-sm"><span className="font-medium">Father Name:</span> {challanData.student?.fatherName}</p>
            <p className="text-sm"><span className="font-medium">Roll No:</span> {challanData.student?.rollNo}</p>
            <p className="text-sm"><span className="font-medium">Class:</span> {challanData.student?.class}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
            <p className="text-sm"><span className="font-medium">Challan No:</span> {challanData.challanNo}</p>
            <p className="text-sm"><span className="font-medium">Issue Date:</span> {new Date(challanData.issueDate).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-medium">Due Date:</span> {new Date(challanData.dueDate).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-medium">Last Payment Date:</span> {new Date(challanData.paymentDate).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-medium">Payment Mode:</span> {challanData.paymentMode}</p>
          </div>
        </div>

        {/* Last Payment Summary */}
        {challanData.lastPayment && (
          <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Last Payment Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Amount Paid:</span> Rs. {challanData.lastPayment.amount}
              </div>
              <div>
                <span className="font-medium">Months Paid:</span> {challanData.lastPayment.months?.join(', ') || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Payment Date:</span> {new Date(challanData.lastPayment.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Payment Mode:</span> {challanData.lastPayment.mode || 'Cash'}
              </div>
            </div>
          </div>
        )}

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
                <td className="border border-gray-300 p-2 text-sm">
                  Tuition Fee ({challanData.months?.join(', ')})
                </td>
                <td className="border border-gray-300 p-2 text-sm text-right">
                  {challanData.feeBreakdown?.tuitionFee?.toLocaleString()}
                </td>
              </tr>
              
              {examinationFee > 0 && (
                <tr>
                  <td className="border border-gray-300 p-2 text-sm">Examination Fee</td>
                  <td className="border border-gray-300 p-2 text-sm text-right">{examinationFee.toLocaleString()}</td>
                </tr>
              )}
              
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
                  <td className="border border-gray-300 p-2 text-sm text-right">{fee.amount.toLocaleString()}</td>
                </tr>
              ))}
              
              <tr>
                <td className="border border-gray-300 p-2 text-sm">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Fee Description"
                      className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <td className="border border-gray-300 p-2 text-sm text-right font-semibold">
                  {challanData.feeBreakdown?.totalAmount?.toLocaleString()}
                </td>
              </tr>
              
              {/* Paid Amount Row */}
              {challanData.feeBreakdown?.paidAmount && (
                <tr className="bg-green-50">
                  <td className="border border-gray-300 p-2 text-sm font-semibold text-green-700">Amount Paid</td>
                  <td className="border border-gray-300 p-2 text-sm text-right font-semibold text-green-700">
                    Rs. {challanData.feeBreakdown.paidAmount.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payment Status */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <CheckCircle size={16} className="mr-2" />
            <span className="font-semibold">Payment Verified</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This challan is generated based on the last payment made on {challanData.paymentDate ? new Date(challanData.paymentDate).toLocaleDateString() : 'N/A'}
          </p>
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