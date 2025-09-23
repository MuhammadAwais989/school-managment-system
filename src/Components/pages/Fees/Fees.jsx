import React, { useState, useEffect } from 'react';
import Sidebar from "../sidebar/SideBar"
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
  Info
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

  // State for students data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BaseURL}/students/details`);
        
        // Check if response is HTML (error) instead of JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned HTML instead of JSON. Please check the endpoint.');
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if data is an array
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array of students');
        }
        
        // Transform API data to match our structure
        const transformedStudents = data.map((student, index) => {
          // Calculate fees information based on your business logic
          const monthlyFee = monthlyFees[student.class] || 1000;
          const totalFees = monthlyFee * 10; // Assuming 10 months in academic year
          const paidFees = Math.floor(Math.random() * totalFees); // Random paid amount for demo
          const dues = totalFees - paidFees;
          const status = dues === 0 ? 'Fully Paid' : dues === totalFees ? 'Not Paid' : 'Partially Paid';
          
          // Generate due months based on payment status
          const duesByMonth = allMonths.map(month => ({
            month,
            due: monthlyFee,
            paid: Math.random() > 0.3 // Random paid status for demo
          }));
          
          // Generate payment history
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
            fatherName: student.fatherName || student.fatherName || 'Unknown Father',
            class: student.class || 'Not Assigned',
            section: student.section || 'A',
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
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message);
        setLoading(false);
        
        // Fallback to sample data if API fails
        setStudents([
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
            duesByMonth: allMonths.map(month => ({ month, due: 1700, paid: true }))
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
            duesByMonth: allMonths.map((month, i) => ({ 
              month, 
              due: 1600, 
              paid: i < 9 // First 9 months paid
            }))
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
            duesByMonth: allMonths.map((month, i) => ({ 
              month, 
              due: 800, 
              paid: i < 6 // First 6 months paid
            }))
          }
        ]);
      }
    };

    fetchStudents();
  }, []);

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
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
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
    });

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
  };

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
          <th>Status</th>
          <th>Due Months</th>
        </tr>
      </thead>
      <tbody>
  `;

    // Add each class section
    Object.keys(groupedStudents).sort().forEach(className => {
      // Add class heading row
      tableContent += `
        <tr>
          <td colspan="10" class="class-heading">${className}</td>
        </tr>
      `;
      
      // Add student rows for this class
      groupedStudents[className].forEach(student => {
        // Get due months for this student
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
          <td>${student.status}</td>
          <td class="due-months">${dueMonths || 'None'}</td>
        </tr>
        `;
      });
    });

    tableContent += `
      </tbody>
    </table>
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading students data...</div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar />

      <div className="flex w-full h-screen bg-gray-0">
        {/* Main Content */}
        <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-screen shadow-md rounded-md px-0 overflow-hidden">
            {/* Error message */}
            {error && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                <p className="font-bold">API Connection Issue</p>
                <p>{error}</p>
                <p className="text-sm mt-1">Using sample data for demonstration.</p>
              </div>
            )}

            {/* Main content */}
            <main className="flex-1 overflow-y-auto md:p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-0">
                <div className="flex items-center">
                  <DollarSign className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
                </div>
                
                {/* Search Bar and Action Buttons */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Roll No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Father Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Class/Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Total Fees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Dues</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                                setSelectedStudent(student);
                                generateChallan(student, allMonths.slice(0, 5));
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

          {/* Payment Modal */}
          {showPaymentModal && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto h-full">
              <div className='h-screen w-full'>
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 mx-auto my-4 md:my-8">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Record Fee Payment</h2>
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

                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs md:text-sm text-blue-700 font-medium">Student</p>
                        <p className="text-sm md:font-semibold">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-blue-700 font-medium">Roll No</p>
                        <p className="text-sm md:font-semibold">{selectedStudent.rollNo}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-blue-700 font-medium">Class</p>
                        <p className="text-sm md:font-semibold">{selectedStudent.class}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-blue-700 font-medium">Monthly Fee</p>
                        <p className="text-sm md:font-semibold">Rs. {selectedStudent.monthlyFee}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs md:text-sm text-blue-700 font-medium">Total Dues</p>
                        <p className="text-sm md:font-semibold text-red-600">Rs. {selectedStudent.dues}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <input
                      type="date"
                      className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Months to Pay</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                      {selectedStudent.duesByMonth
                        .filter(month => !month.paid)
                        .map((monthData, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-center cursor-pointer transition-all ${paymentMonths.includes(monthData.month) ? 'bg-blue-500 text-white border border-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
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
                      className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      max={selectedStudent.dues}
                      min={selectedStudent.monthlyFee}
                    />
                    <p className="text-xs text-gray-500 mt-1">Amount will be auto-calculated based on selected months</p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                    <div className="flex items-center p-2 md:p-3 border border-gray-300 rounded-lg bg-gray-50">
                      <DollarSign size={18} className="text-gray-500 mr-2" />
                      <span>Cash</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setPaymentMonths([]);
                      }}
                      className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handlePayment(selectedStudent)}
                      className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Details Modal */}
          {showDetailsModal && detailsStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 mx-auto my-4 md:p-6 md:my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Student Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Student</p>
                      <p className="text-sm md:text-base font-semibold">{detailsStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Roll No</p>
                      <p className="text-sm md:text-base font-semibold">{detailsStudent.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Father Name</p>
                      <p className="text-sm md:text-base font-semibold">{detailsStudent.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Class</p>
                      <p className="text-sm md:text-base font-semibold">{detailsStudent.class}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Total Fees</p>
                      <p className="text-sm md:text-base font-semibold">Rs. {detailsStudent.totalFees}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-blue-700 font-medium">Dues</p>
                      <p className="text-sm md:text-base font-semibold text-red-600">Rs. {detailsStudent.dues}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Month-wise Dues Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 mx-auto my-4 md:p-6 md:my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Fee Challan</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={printChallan}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm flex items-center"
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

                <div className="p-4 md:p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center mb-4 md:mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-800">City School System</h1>
                    <p className="text-sm text-gray-600">123 Education Street, Karachi, Pakistan</p>
                    <p className="text-sm text-gray-600">Phone: 021-1234567 | Email: info@cityschool.edu.pk</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <h3 className="text-md md:text-lg font-semibold text-gray-800">Student Information</h3>
                      <p className="text-sm"><span className="font-medium">Name:</span> {challanData.name}</p>
                      <p className="text-sm"><span className="font-medium">Father Name:</span> {challanData.fatherName}</p>
                      <p className="text-sm"><span className="font-medium">Roll No:</span> {challanData.rollNo}</p>
                      <p className="text-sm"><span className="font-medium">Class:</span> {challanData.class}</p>
                    </div>

                    <div>
                      <h3 className="text-md md:text-lg font-semibold text-gray-800">Challan Information</h3>
                      <p className="text-sm"><span className="font-medium">Challan No:</span> CH-{challanData.rollNo}-2023</p>
                      <p className="text-sm"><span className="font-medium">Issue Date:</span> {new Date().toLocaleDateString()}</p>
                      <p className="text-sm"><span className="font-medium">Due Date:</span> {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> <span className="font-semibold text-red-600">Pending</span></p>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <h3 className="text-md md:text-lg font-semibold text-gray-800 mb-2">Fee Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-1 md:p-2 text-left text-xs md:text-sm">Description</th>
                            <th className="border border-gray-300 p-1 md:p-2 text-right text-xs md:text-sm">Amount (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm">Tuition Fee ({challanMonths.join(', ')})</td>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm text-right">{challanData.monthlyFee * challanMonths.length}</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm">
                              <input
                                type="text"
                                placeholder="Examination Fee"
                                className="w-full p-1 border-none focus:outline-none"
                                value={examinationFee > 0 ? "Examination Fee" : ""}
                                onChange={(e) => setExaminationFee(e.target.value ? parseInt(e.target.value) : 0)}
                              />
                            </td>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm text-right">
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
                              <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm">
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
                              <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm text-right">{fee.amount}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm">
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
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm text-right">
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
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm font-semibold">Total Amount</td>
                            <td className="border border-gray-300 p-1 md:p-2 text-xs md:text-sm text-right font-semibold">{calculateChallanTotal()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="text-center text-xs md:text-sm text-gray-500">
                    <p>Please pay this amount at any branch of ABC Bank or at the school fee counter</p>
                    <p>This challan is computer generated and does not require signature</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="All">All Classes</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG-I A">KG-I A</option>
                    <option value="KG-I B">KG-I B</option>
                    <option value="KG-II A">KG-II A</option>
                    <option value="KG-II B">KG-II B</option>
                    <option value="One A">One A</option>
                    <option value="One B">One B</option>
                    <option value="Two A">Two A</option>
                    <option value="Two B">Two B</option>
                    <option value="Three A">Three A</option>
                    <option value="Three B">Three B</option>
                    <option value="Four A">Four A</option>
                    <option value="Four B">Four B</option>
                    <option value="Five A">Five A</option>
                    <option value="Five B">Five B</option>
                    <option value="Six A">Six A</option>
                    <option value="Six B">Six B</option>
                    <option value="Seven A">Seven A</option>
                    <option value="Seven B">Seven B</option>
                    <option value="Eight A">Eight A</option>
                    <option value="Eight B">Eight B</option>
                    <option value="Nine A">Nine A</option>
                    <option value="Nine B">Nine B</option>
                    <option value="Matric A">Matric A</option>
                    <option value="Matric B">Matric B</option>
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
                    <option value='Partially Paid'>Partially Paid</option>
                    <option value="Not Paid">Not Paid</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedClass('All');
                      setSelectedStatus('All');
                      setShowFilterModal(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
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