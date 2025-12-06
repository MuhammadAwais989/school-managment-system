import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/SideBar";
import axios from "axios";
import { BaseURL } from "../../helper/helper";
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
  Hash,
} from "react-feather";
import Loading from "../Loading";
import PageTitle from "../PageTitle";
import ExcelExport from "../ExportExcel";

const FeesManagement = () => {
  // Define all months for the academic year
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // State for students data
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMonths, setPaymentMonths] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [showChallan, setShowChallan] = useState(false);
  const [challanData, setChallanData] = useState(null);
  const [challanMonths, setChallanMonths] = useState([]);
  const [examinationFee, setExaminationFee] = useState(0);
  const [otherFees, setOtherFees] = useState([]);
  const [newFeeDescription, setNewFeeDescription] = useState("");
  const [newFeeAmount, setNewFeeAmount] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Date/Month filter states for fees collection
  const [feesFilterType, setFeesFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Summary states
  const [totalFeesCollection, setTotalFeesCollection] = useState(0);
  const [totalDues, setTotalDues] = useState(0);
  const [fullyPaidStudents, setFullyPaidStudents] = useState(0);

  // Current month collection state
  const [currentMonthCollection, setCurrentMonthCollection] = useState(0);
  const [currentMonthDues, setCurrentMonthDues] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // ✅ SINGLE API CALL 
  const fetchAllStudents = async () => {
    try {
      setLoading(true);

      // Use COMBINED API that gets students from main API + fees from separate system
      const response = await axios.get(`${BaseURL}/fees/combined`);
      const data = response.data;

      // Role-based filtering
      const role = localStorage.getItem("role");
      let filteredStudents = data.students;

      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        filteredStudents = data.students.filter(
          (student) =>
            student.Class === assignedClass &&
            student.section === assignedSection
        );
      }

      // Use ACTUAL data from combined system
      const processedStudents = filteredStudents.map((student) => ({
        ...student,
        class: student.Class,
        section: student.section,
      }));

      // All students 
      setAllStudents(processedStudents);

      // Calculate current month collection and dues
      calculateCurrentMonthData(processedStudents);

      // Initial display 
      applyFiltersAndPagination(processedStudents);

      setError(null);
    } catch (err) {
      console.error("Error fetching combined data:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch students data";
      setError(errorMessage);
      setAllStudents([]);
      setStudents([]);
      setTotalPages(1);
      setTotalStudents(0);
      setTotalFeesCollection(0);
      setTotalDues(0);
      setFullyPaidStudents(0);
      setCurrentMonthCollection(0);
      setCurrentMonthDues(0);
    } finally {
      setLoading(false);
    }
  };

  // CALCULATE CURRENT MONTH COLLECTION AND DUES
  const calculateCurrentMonthData = (studentsData) => {
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const currentYear = new Date().getFullYear();
      
      let monthCollection = 0;
      let monthDues = 0;

      studentsData.forEach((student) => {
        // Calculate current month dues
        const monthlyFee = student.monthlyFee || Number(student.Fees) || 0;
        const currentMonthDue = student.duesByMonth?.find(
          month => month.month === currentMonth && !month.paid
        );
        
        if (currentMonthDue) {
          monthDues += currentMonthDue.dueAmount || monthlyFee;
        }

        // Calculate current month collection from payment history
        if (student.paymentHistory) {
          student.paymentHistory.forEach((payment) => {
            const paymentDate = new Date(payment.date);
            const paymentMonth = paymentDate.toLocaleString('default', { month: 'long' });
            const paymentYear = paymentDate.getFullYear();
            
            if (paymentMonth === currentMonth && paymentYear === currentYear) {
              monthCollection += payment.amount || 0;
            }
          });
        }
      });

      setCurrentMonthCollection(monthCollection);
      setCurrentMonthDues(monthDues);

      // Store in localStorage for AdminDashboard to access
      localStorage.setItem('currentMonthCollection', monthCollection.toString());
      localStorage.setItem('currentMonthDues', monthDues.toString());
      localStorage.setItem('currentMonth', currentMonth);

    } catch (error) {
      console.error("Error calculating current month data:", error);
      setCurrentMonthCollection(0);
      setCurrentMonthDues(0);
    }
  };

  // FILTER AND PAGINATION FUNCTION - Client-side processing
  const applyFiltersAndPagination = (studentsData = allStudents) => {
    let resultStudents = [...studentsData];

    // Search filter
    if (searchTerm) {
      resultStudents = resultStudents.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass !== "All") {
      resultStudents = resultStudents.filter(
        (student) => student.Class === selectedClass
      );
    }

    // Status filter
    if (selectedStatus !== "All") {
      resultStudents = resultStudents.filter(
        (student) => student.status === selectedStatus
      );
    }

    // TOTAL CALCULATIONS - Sabhi filtered students ki total fees calculate karein
    const allStudentsTotalFees = resultStudents.reduce(
      (sum, student) => sum + (student.paidFees || 0),
      0
    );
    const allStudentsTotalDues = resultStudents.reduce(
      (sum, student) => sum + (student.dues || 0),
      0
    );
    const allStudentsFullyPaid = resultStudents.filter(
      (student) => student.status === "Fully Paid"
    ).length;

    // Total values set karein
    setTotalFeesCollection(allStudentsTotalFees);
    setTotalDues(allStudentsTotalDues);
    setFullyPaidStudents(allStudentsFullyPaid);

    // PAGINATION CALCULATION
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStudents = resultStudents.slice(startIndex, endIndex);

    setStudents(paginatedStudents);
    setTotalPages(Math.ceil(resultStudents.length / itemsPerPage));
    setTotalStudents(resultStudents.length);
  };

  // INITIAL DATA FETCH 
  useEffect(() => {
    fetchAllStudents();
  }, []);

  // FILTERS CHANGE PAR - Client-side processing
  useEffect(() => {
    setCurrentPage(1);
    applyFiltersAndPagination();
  }, [searchTerm, selectedClass, selectedStatus]);

  // ✅ PAGINATION CHANGE PAR - Client-side processing
  useEffect(() => {
    applyFiltersAndPagination();
  }, [currentPage, itemsPerPage]);



  // Show student details
  const showStudentDetails = async (student) => {
    try {
      console.log("Student payment history:", student.paymentHistory);

      const studentDetails = {
        ...student,
        paymentHistory: student.paymentHistory || [],
      };

      setDetailsStudent(studentDetails);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error in showStudentDetails:", error);
      setDetailsStudent({
        ...student,
        paymentHistory: [],
      });
      setShowDetailsModal(true);
    }
  };

  // Handle fee payment
  const handlePayment = async (student) => {
    if (!paymentAmount || paymentAmount <= 0 || paymentAmount > student.dues) {
      return;
    }

    if (paymentMonths.length === 0) {
      alert("Please select at least one month for payment");
      return;
    }

    try {
      const studentId = student._id;

      const paymentData = {
        amount: parseInt(paymentAmount),
        months: paymentMonths,
        paymentDate: paymentDate,
        mode: paymentMode,
      };


      const response = await axios.post(
        `${BaseURL}/fees/${studentId}/payment`,
        paymentData
      );

      if (response.data.success) {

        await fetchAllStudents();

        setShowPaymentModal(false);
        setPaymentAmount("");
        setPaymentMonths([]);
        setPaymentMode("Cash");
      }
    } catch (error) {
      console.error("Payment error:", error);

      let errorMessage = "Payment failed. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        console.error("Server response:", error.response.data);

        if (error.response.data?.message === "Student not found") {
          errorMessage =
            "Student not found in database. Please check if student exists.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

    }
  };

  // Generate challan with last payment data
  const generateChallan = async (student, months = []) => {
    try {
      console.log(
        "🔄 Generating challan with last payment data for:",
        student.name
      );

      const lastPayment =
        student.paymentHistory && student.paymentHistory.length > 0
          ? student.paymentHistory[student.paymentHistory.length - 1]
          : null;

      console.log("📋 Last payment:", lastPayment);

      if (!lastPayment) {
        alert(
          "No payment history found for this student. Please make a payment first."
        );
        return;
      }

      const paymentMonths = lastPayment.months || [];
      const paymentAmount = lastPayment.amount || 0;
      const paymentDate = lastPayment.date
        ? new Date(lastPayment.date)
        : new Date();
      const paymentMode = lastPayment.mode || "Cash";

      const monthlyFee = student.monthlyFee || Number(student.Fees) || 0;
      const tuitionFee = paymentAmount;

      const totalAmount =
        tuitionFee +
        examinationFee +
        otherFees.reduce((sum, fee) => sum + fee.amount, 0);

      const challanData = {
        student: {
          name: student.name,
          fatherName: student.fatherName,
          rollNo: student.rollNo,
          class: student.class || student.Class,
          section: student.section,
        },
        challanNo: `CH-${student.rollNo}-${Date.now()}`,
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        months: paymentMonths,
        paymentDate: paymentDate.toISOString(),
        paymentMode: paymentMode,
        academicYear: "2024-2025",
        feeBreakdown: {
          tuitionFee: tuitionFee,
          examinationFee: examinationFee,
          otherFees: otherFees,
          totalAmount: totalAmount,
          paidAmount: paymentAmount,
        },
        lastPayment: lastPayment,
      };

      console.log("✅ Challan generated with last payment data:", challanData);

      setChallanData(challanData);
      setChallanMonths(paymentMonths);
      setShowChallan(true);
    } catch (error) {
      console.error("❌ Error generating challan:", error);
      alert("Failed to generate challan. Please try again.");
    }
  };

  // Get due list - WITH MONTHS COLUMN
  const getDueList = async () => {
    try {
      console.log("🔄 Generating due list with months data...");

      let dueStudents = allStudents.filter(
        (student) => (student.dues || 0) > 0 && student.status !== "Fully Paid"
      );

      if (selectedClass !== "All") {
        dueStudents = dueStudents.filter(
          (student) =>
            student.Class === selectedClass || student.class === selectedClass
        );
      }

      const totalDues = dueStudents.reduce(
        (sum, student) => sum + (student.dues || 0),
        0
      );

      const dueData = {
        dueStudents: dueStudents.map((student) => {
          const unpaidMonths =
            student.duesByMonth?.filter(
              (month) => !month.paid && month.dueAmount > 0
            ) || [];
          const dueMonthNames = unpaidMonths.map((month) => month.month);

          return {
            rollNo: student.rollNo,
            name: student.name,
            class: student.class || student.Class,
            section: student.section,
            dues: student.dues || 0,
            status: student.status,
            dueMonths: dueMonthNames,
            dueMonthsCount: dueMonthNames.length,
            monthlyFee: student.monthlyFee || 0,
          };
        }),
        totalDues: totalDues,
        totalStudents: dueStudents.length,
      };

      console.log("✅ Due list with months generated:", dueData);
      return dueData;
    } catch (error) {
      console.error("Error generating due list:", error);
      return {
        dueStudents: [],
        totalDues: 0,
        totalStudents: 0,
      };
    }
  };

  // Generate PDF for due list - WITH MONTHS COLUMN
  const generateDueListPDF = async () => {
    try {
      console.log("🔄 Generating due list PDF with months...");

      const dueData = await getDueList();

      if (!dueData.dueStudents || dueData.dueStudents.length === 0) {
        alert("No students with dues found matching your criteria.");
        return;
      }

      let content = `
      <html>
        <head>
          <title>Due List Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background-color: #f8fafc;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e53e3e;
              padding-bottom: 20px;
            }
            h1 { 
              color: #2c5282; 
              margin: 0;
              font-size: 28px;
            }
            .subtitle {
              color: #718096;
              font-size: 16px;
              margin-top: 5px;
            }
            .summary { 
              margin: 25px 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #fed7d7 0%, #feebeb 100%);
              border-radius: 8px;
              border-left: 4px solid #e53e3e;
            }
            .summary h3 {
              margin: 0 0 15px 0;
              color: #742a2a;
              font-size: 18px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
            }
            .summary-item {
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              color: #e53e3e;
              margin-bottom: 5px;
            }
            .summary-label {
              font-size: 12px;
              color: #718096;
              text-transform: uppercase;
              font-weight: 600;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              font-size: 13px;
            }
            th { 
              background: linear-gradient(135deg, #2c5282 0%, #3182ce 100%);
              color: white;
              font-weight: bold;
              text-align: left;
              padding: 12px 8px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td { 
              padding: 10px 8px; 
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            tr:hover {
              background-color: #f7fafc;
            }
            .due { 
              color: #e53e3e; 
              font-weight: bold;
            }
            .months {
              max-width: 200px;
            }
            .month-tag {
              display: inline-block;
              background: #fed7d7;
              color: #c53030;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              margin: 1px;
              border: 1px solid #feb2b2;
            }
            .no-data {
              text-align: center;
              padding: 40px;
              color: #718096;
              font-style: italic;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #718096;
              font-size: 12px;
            }
            .school-info {
              text-align: center;
              margin-bottom: 10px;
            }
            .school-name {
              font-size: 24px;
              font-weight: bold;
              color: #2c5282;
              margin: 0;
            }
            .school-address {
              color: #718096;
              font-size: 14px;
              margin: 5px 0 15px 0;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              display: inline-block;
            }
            .status-partial {
              background: #fef5e7;
              color: #d97706;
            }
            .status-notpaid {
              background: #fed7d7;
              color: #c53030;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="school-info">
              <h1 class="school-name">City School System</h1>
              <p class="school-address">123 Education Street, Karachi, Pakistan</p>
            </div>
            
            <div class="header">
              <h1>Due List Report</h1>
              <p class="subtitle">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>

            <div class="summary">
              <h3>📊 Dues Summary</h3>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${dueData.totalStudents}</div>
                  <div class="summary-label">Students with Dues</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">Rs. ${
                    dueData.totalDues?.toLocaleString() || "0"
                  }</div>
                  <div class="summary-label">Total Dues Amount</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${
                    selectedClass === "All" ? "All" : selectedClass
                  }</div>
                  <div class="summary-label">Class Filter</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${dueData.dueStudents.reduce(
                    (sum, student) => sum + (student.dueMonthsCount || 0),
                    0
                  )}</div>
                  <div class="summary-label">Total Due Months</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Due Amount</th>
                  <th>Due Months</th>
                  <th>Monthly Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
    `;

      if (dueData.dueStudents && dueData.dueStudents.length > 0) {
        dueData.dueStudents.forEach((student) => {
          const monthTags =
            student.dueMonths && student.dueMonths.length > 0
              ? student.dueMonths
                  .map((month) => `<span class="month-tag">${month}</span>`)
                  .join("")
              : '<span style="color: #718096; font-style: italic;">No months data</span>';

          content += `
          <tr>
            <td><strong>${student.rollNo || "N/A"}</strong></td>
            <td>${student.name || "N/A"}</td>
            <td>${student.class || "N/A"}</td>
            <td>${student.section || "N/A"}</td>
            <td class="due"><strong>Rs. ${(
              student.dues || 0
            ).toLocaleString()}</strong></td>
            <td class="months">
              <div style="max-height: 80px; overflow-y: auto;">
                ${monthTags}
                ${
                  student.dueMonthsCount > 0
                    ? `<div style="margin-top: 5px; font-size: 10px; color: #718096;">Total: ${student.dueMonthsCount} months</div>`
                    : ""
                }
              </div>
            </td>
            <td>Rs. ${(student.monthlyFee || 0).toLocaleString()}</td>
            <td>
              <span class="status-badge ${
                student.status === "Partially Paid"
                  ? "status-partial"
                  : "status-notpaid"
              }">
                ${student.status || "Not Paid"}
              </span>
            </td>
          </tr>
        `;
        });
      } else {
        content += `
        <tr>
          <td colspan="8" class="no-data">
            🎉 No students with dues found matching your criteria!
          </td>
        </tr>
      `;
      }

      content += `
              </tbody>
            </table>

            <div class="footer">
              <p>Generated by School Management System | ${
                dueData.dueStudents?.length || 0
              } records</p>
              <p>Filters Applied: 
                ${
                  selectedClass !== "All"
                    ? "Class: " + selectedClass + " | "
                    : ""
                }
                ${searchTerm ? "Search: " + searchTerm + " | " : ""}
                Dues Only
              </p>
              <p style="margin-top: 5px; color: #e53e3e; font-weight: bold;">
                💡 Note: This report shows all unpaid months for each student with dues.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

      const printWindow = window.open("", "_blank", "width=1200,height=800");
      printWindow.document.write(content);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate due list PDF. Please try again.");
    }
  };



  // Export data to Excel
  const exportToExcel = async () => {
    try {
      console.log("🔄 Exporting ALL students data to Excel...");

      let studentsData = [...allStudents];

      const role = localStorage.getItem("role");
      if (role === "Teacher") {
        const assignedClass = localStorage.getItem("classAssigned");
        const assignedSection = localStorage.getItem("classSection");

        studentsData = studentsData.filter(
          (student) =>
            student.Class === assignedClass &&
            student.section === assignedSection
        );
      }

      if (searchTerm) {
        studentsData = studentsData.filter(
          (student) =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedClass !== "All") {
        studentsData = studentsData.filter(
          (student) =>
            student.Class === selectedClass || student.class === selectedClass
        );
      }

      if (selectedStatus !== "All") {
        studentsData = studentsData.filter(
          (student) => student.status === selectedStatus
        );
      }


      const totalFeesCollection = studentsData.reduce(
        (sum, student) => sum + (student.paidFees || 0),
        0
      );
      const totalDues = studentsData.reduce(
        (sum, student) => sum + (student.dues || 0),
        0
      );
      const fullyPaidCount = studentsData.filter(
        (student) => student.status === "Fully Paid"
      ).length;
      const partiallyPaidCount = studentsData.filter(
        (student) => student.status === "Partially Paid"
      ).length;
      const notPaidCount = studentsData.filter(
        (student) => student.status === "Not Paid"
      ).length;

      let tableContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <title>Fees Management Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header {font-size: 14px; text-align: center; margin-bottom: 20px; }
          .summary { margin: 20px 0; padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; }
          .summary h3 {font-size: 14px; margin-top: 0; color: #2d3748; }
          .summary-grid { display: flex; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 10px; }
          .summary-item { padding: 10px; background: white; border-radius: 5px; border: 1px solid #e2e8f0; }
          .summary-value { font-size: 12px; font-weight: bold; color: #2d3748; }
          .summary-label { font-size: 12px; color: #718096; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { font-size: 14px; background-color: #E3F2FD; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #ddd; }
          td { font-size: 12px; padding: 8px 10px; border: 1px solid #ddd; mso-number-format: "\\@"; }
          .fully-paid { color: #059669; }
          .partially-paid { color: #d97706; }
          .not-paid { color: #dc2626; }
          .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #718096; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="header">Fees Management Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="summary">
      <h3>Summary</h3>
      <table class="summary-table">
        <tr></tr>

        <tr>
          <td>
            <div class="summary-value">${studentsData.length}</div>
            <div class="summary-label">Total Students</div>
          </td>
          <td>
            <div class="summary-value">Rs. ${totalFeesCollection.toLocaleString()}</div>
            <div class="summary-label">Total Collected</div>
          </td>
          <td>
            <div class="summary-value">Rs. ${totalDues.toLocaleString()}</div>
            <div class="summary-label">Total Dues</div>
          </td>
          <td>
            <div class="summary-value">${fullyPaidCount}</div>
            <div class="summary-label">Fully Paid</div>
          </td>
          <td>
            <div class="summary-value">${partiallyPaidCount}</div>
            <div class="summary-label">Partially Paid</div>
          </td>
          <td>
            <div class="summary-value">${notPaidCount}</div>
            <div class="summary-label">Not Paid</div>
          </td>
        </tr>
        <tr></tr>
        <tr></tr>
      </table>
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
              <th>Payment Months</th>
            </tr>
          </thead>
          <tbody>
    `;

      studentsData.forEach((student) => {
        const statusClass =
          student.status === "Fully Paid"
            ? "fully-paid"
            : student.status === "Partially Paid"
            ? "partially-paid"
            : "not-paid";

        let lastPaymentDate = "N/A";
        let paymentMonths = "N/A";

        if (student.paymentHistory && student.paymentHistory.length > 0) {
          const lastPayment =
            student.paymentHistory[student.paymentHistory.length - 1];
          lastPaymentDate = new Date(lastPayment.date).toLocaleDateString();
          paymentMonths = lastPayment.months
            ? lastPayment.months.join(", ")
            : "N/A";
        }

        tableContent += `
        <tr>
          <td>${student.rollNo || "N/A"}</td>
          <td>${student.name || "N/A"}</td>
          <td>${student.fatherName || "N/A"}</td>
          <td>${student.class || student.Class || "N/A"}</td>
          <td>${student.section || "N/A"}</td>
          <td>${
            student.monthlyFee
              ? "Rs. " + student.monthlyFee.toLocaleString()
              : "N/A"
          }</td>
          <td>${
            student.Fees ? "Rs. " + student.Fees.toLocaleString() : "N/A"
          }</td>
          <td>${
            student.paidFees
              ? "Rs. " + student.paidFees.toLocaleString()
              : "Rs. 0"
          }</td>
          <td>${
            student.dues ? "Rs. " + student.dues.toLocaleString() : "Rs. 0"
          }</td>
          <td class="${statusClass}">${student.status || "Not Paid"}</td>
          <td>${lastPaymentDate}</td>
          <td>${paymentMonths}</td>
        </tr>
      `;
      });

      tableContent += `
          </tbody>
        </table>

        <div class="footer">
          <p>Generated by School Management System | ${
            studentsData.length
          } records exported</p>
          <p>Filters Applied: 
            ${searchTerm ? "Search: " + searchTerm + " | " : ""}
            ${selectedClass !== "All" ? "Class: " + selectedClass + " | " : ""}
            ${
              selectedStatus !== "All"
                ? "Status: " + selectedStatus
                : "All Statuses"
            }
          </p>
          <p style="color: #059669; font-weight: bold; margin-top: 10px;">
            ✅ Complete Report: All students data exported successfully
          </p>
        </div>
      </body>
      </html>
    `;

      const blob = new Blob([tableContent], {
        type: "application/vnd.ms-excel;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `complete_fees_report_${timestamp}.xls`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      console.log("✅ Excel export completed successfully");
    } catch (error) {
      console.error("❌ Error exporting to Excel:", error);
      alert("Failed to export data to Excel. Please try again.");
    }
  };

  // Calculate filtered fees collection based on month/date
  const calculateFilteredFeesCollection = () => {
    if (!selectedMonth && !selectedDate) {
      return totalFeesCollection;
    }

    let filteredFees = 0;

    allStudents.forEach((student) => {
      if (student.paymentHistory) {
        student.paymentHistory.forEach((payment) => {
          const paymentDateObj = new Date(payment.date);

          const paymentMonth = paymentDateObj.toLocaleString("default", {
            month: "long",
          });

          const paymentDate = paymentDateObj.toISOString().split("T")[0];
          const [paymentYear, paymentMonthNum, paymentDay] =
            paymentDate.split("-");
          const paymentDateFormatted = `${paymentYear}-${paymentMonthNum}-${paymentDay}`;

          if (selectedMonth && !selectedDate) {
            if (paymentMonth === selectedMonth) {
              filteredFees += payment.amount || 0;
            }
          }
          else if (!selectedMonth && selectedDate) {
            if (paymentDateFormatted === selectedDate) {
              filteredFees += payment.amount || 0;
            }
          }
          else if (selectedMonth && selectedDate) {
            if (
              paymentMonth === selectedMonth &&
              paymentDateFormatted === selectedDate
            ) {
              filteredFees += payment.amount || 0;
            }
          }
        });
      }
    });

    return filteredFees;
  };

  // Format date for display without timezone issues
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Toggle month selection for payment
  const toggleMonthSelection = (month) => {
    if (paymentMonths.includes(month)) {
      setPaymentMonths(paymentMonths.filter((m) => m !== month));
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
    if (newFeeDescription && newFeeAmount && parseInt(newFeeAmount) > 0) {
      setOtherFees([
        ...otherFees,
        {
          description: newFeeDescription,
          amount: parseInt(newFeeAmount),
        },
      ]);
      setNewFeeDescription("");
      setNewFeeAmount("");
    } else {
      alert("Please enter both description and a valid amount greater than 0");
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
    const tuitionFee =
      challanData?.feeBreakdown?.tuitionFee ||
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
    if (status === "Fully Paid") {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (status === "Partially Paid") {
      return <AlertCircle size={16} className="text-yellow-500" />;
    } else {
      return <XCircle size={16} className="text-red-500" />;
    }
  };

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
        pageNumbers.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Agar loading chal raha hai toh Loading component dikhao
  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-screen shadow-md rounded-md px-4 max-sm:px-4 pt-2 overflow-hidden">
            <main className="flex-1 overflow-y-auto md:p-2 bg-gray-50">
              <Loading 
                type="skeleton"
                skeletonType="fees"
                overlay={false}
                fullScreen={false}
              />
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="flex w-full h-screen ">
        <div className="lg:pl-[90px] max-sm:mt-[-79px] max-sm:pt-[79px] sm:pt-2 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full min-h-screen">
          <div className="bg-white w-full min-h-screen shadow-md rounded-md px-0  overflow-hidden">
            <main className="flex-1 overflow-y-auto md:p-2 bg-gray-50">
              {/* Header Section */}
              <PageTitle
                title="Fees Management"
                description="Manage student fees, payments, and financial records"
                icon={DollarSign}
                showFeesHeader={true}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onFilterClick={() => setShowFilterModal(true)}
                onDueListClick={generateDueListPDF}
                onExportClick={exportToExcel}
                bgGradient="bg-gradient-to-r from-white to-blue-50/30"
                borderColor="border-blue-100/50"
                iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
                showStatusBadge={true}
              />

              {/* Summary Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-3 mb-4">
                {/* Total Students Card */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600/80 text-sm font-semibold uppercase tracking-wide mb-2">
                        Total Students
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {totalStudents.toLocaleString()}
                      </h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="text-white" size={28} />
                    </div>
                  </div>
                </div>

                {/* Fees Collected Card */}
                <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-green-600/80 text-sm font-semibold uppercase tracking-wide mb-2">
                        Fees Collected
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        Rs. {calculateFilteredFeesCollection().toLocaleString()}
                      </h3>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="text-white" size={28} />
                    </div>
                  </div>
                </div>

                {/* Total Dues Card - UPDATED WITH CURRENT MONTH DUES */}
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl px-4 pb-0 pt-2 shadow-lg border border-orange-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-orange-600/80 text-xs font-semibold uppercase tracking-wide mb-1">
        Total Dues
      </p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Rs. {totalDues.toLocaleString()}
      </h3>
      
      {/* Compact Current Month Dues */}
      <div className="flex justify-between items-center bg-orange-50/80 rounded-lg px-3 py-0">
        <p className="text-orange-600 text-sm font-medium">
          Current Month
        </p>
        <p className="text-orange-700 text-base font-semibold">
          Rs. {currentMonthDues.toLocaleString()}
        </p>
      </div>
    </div>
    
    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ml-3">
      <AlertCircle className="text-white" size={20} />
    </div>
  </div>
</div>

                {/* Fully Paid Card */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600/80 text-sm font-semibold uppercase tracking-wide mb-2">
                        Fully Paid
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {fullyPaidStudents.toLocaleString()}
                      </h3>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Roll No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Father Name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Class/Section
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Total Fees
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Dues
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Actions
                        </th>
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
                                <div className="font-mono font-semibold text-gray-900 text-sm">
                                  {student.rollNo}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="font-semibold text-gray-900 text-sm">
                              {student.name}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle">
                            <div className="font-semibold text-gray-900 text-sm">
                              {student.fatherName}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-center">
                            <div className="inline-flex flex-col items-center justify-center">
                              <span className="font-bold text-gray-900 text-sm">
                                {student.class}
                              </span>
                              <span className="text-xs text-gray-500">
                                Section {student.section}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-right">
                            <div className="space-y-1">
                              <div className="font-bold text-gray-900 text-sm">
                                Rs. {student.Fees?.toLocaleString()}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-right">
                            <div
                              className={`space-y-1 ${
                                student.dues > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              <div className="font-bold text-sm">
                                Rs. {student.dues?.toLocaleString()}
                              </div>
                              <div className="text-xs font-medium">
                                {student.dues > 0 ? "Due" : "Clear"}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 align-middle text-center">
                            <div className="flex justify-center">
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full ${
                                  student.status === "Fully Paid"
                                    ? "bg-green-100 text-green-800"
                                    : student.status === "Partially Paid"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    student.status === "Fully Paid"
                                      ? "bg-green-500"
                                      : student.status === "Partially Paid"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <span className="text-xs font-semibold">
                                  {student.status}
                                </span>
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
                                className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white transition-colors ${
                                  student.dues === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                <DollarSign size={14} className="mr-1" />
                                Pay
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  generateChallan(
                                    student,
                                    allMonths.slice(0, 5)
                                  );
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
                    <p className="mt-2">
                      No students found matching your criteria
                    </p>
                  </div>
                )}

                {students.length > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 bg-white">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalStudents)}
                      </span>{" "}
                      of <span className="font-medium">{totalStudents}</span>{" "}
                      students
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
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentPage === 1
                            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {getPageNumbers().map((pageNumber, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof pageNumber === "number" &&
                            setCurrentPage(pageNumber)
                          }
                          disabled={pageNumber === "..."}
                          className={`min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                              : pageNumber === "..."
                              ? "border-gray-300 bg-white text-gray-500 cursor-default"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentPage === totalPages
                            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Record Fee Payment
                  </h2>
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

                <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">
                        Student
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        {selectedStudent.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">
                        Roll No
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        {selectedStudent.rollNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">
                        Class
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        {selectedStudent.class}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">
                        Monthly Fee
                      </p>
                      <p className="font-semibold text-sm sm:text-base">
                        Rs. {selectedStudent.monthlyFee}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs sm:text-sm text-blue-700 font-medium">
                        Total Dues
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-red-600">
                        Rs. {selectedStudent.dues}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Months to Pay
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 sm:max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                    {selectedStudent.duesByMonth
                      ?.filter((month) => !month.paid && month.dueAmount > 0)
                      .map((monthData, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-center cursor-pointer transition-all ${
                            paymentMonths.includes(monthData.month)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => toggleMonthSelection(monthData.month)}
                        >
                          <div className="text-xs sm:text-sm font-medium">
                            {monthData.month}
                          </div>
                          <div className="text-xs">
                            Rs. {monthData.dueAmount}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={selectedStudent.dues}
                    min={selectedStudent.monthlyFee}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentMonths([]);
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePayment(selectedStudent)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
                  <h2 className="text-xl font-bold text-gray-800">
                    Student Details
                  </h2>
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
                      <p className="text-sm text-blue-700 font-medium">
                        Student
                      </p>
                      <p className="font-semibold">{detailsStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Roll No
                      </p>
                      <p className="font-semibold">{detailsStudent.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Father Name
                      </p>
                      <p className="font-semibold">
                        {detailsStudent.fatherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Class & Section
                      </p>
                      <p className="font-semibold">
                        {detailsStudent.Class} - {detailsStudent.section}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Total Fees
                      </p>
                      <p className="font-semibold">Rs. {detailsStudent.Fees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Dues</p>
                      <p className="font-semibold text-red-600">
                        Rs. {detailsStudent.dues}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Month-wise Dues Status
                  </h3>
                  <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
                    {detailsStudent.duesByMonth?.map((monthData, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-center ${
                          monthData.paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {monthData.month}
                        </div>
                        <div className="text-xs">Rs. {monthData.dueAmount}</div>
                        <div className="text-xs">
                          {monthData.paid ? "Paid" : "Due"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Payment History
                  </h3>
                  {detailsStudent.paymentHistory &&
                  detailsStudent.paymentHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Months Paid
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Amount
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Mode
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Receipt No
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {detailsStudent.paymentHistory.map(
                            (payment, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {new Date(payment.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {payment.months
                                    ? payment.months.join(", ")
                                    : "N/A"}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  Rs. {payment.amount}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {payment.mode || "Cash"}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  {payment.receiptNo || "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <DollarSign
                        size={48}
                        className="mx-auto text-gray-400 mb-2"
                      />
                      <p className="text-gray-500 text-lg">
                        No Payment History
                      </p>
                      <p className="text-gray-400 text-sm">
                        This student hasn't made any payments yet.
                      </p>
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
                  <h2 className="text-xl font-bold text-gray-800">
                    Fee Challan (Last Payment)
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={printChallan}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <Printer size={14} className="mr-1" />
                      Print
                    </button>
                    <button
                      onClick={() => {
                        setShowChallan(false);
                        setOtherFees([]);
                        setNewFeeDescription("");
                        setNewFeeAmount("");
                        setExaminationFee(0);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-800">
                      City School System
                    </h1>
                    <p className="text-sm text-gray-600">
                      123 Education Street, Karachi, Pakistan
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Student Information
                      </h3>
                      <p className="text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {challanData.student?.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Father Name:</span>{" "}
                        {challanData.student?.fatherName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Roll No:</span>{" "}
                        {challanData.student?.rollNo}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Class:</span>{" "}
                        {challanData.student?.class}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Payment Information
                      </h3>
                      <p className="text-sm">
                        <span className="font-medium">Challan No:</span>{" "}
                        {challanData.challanNo}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Issue Date:</span>{" "}
                        {new Date(challanData.issueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Due Date:</span>{" "}
                        {new Date(challanData.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Last Payment Date:</span>{" "}
                        {new Date(challanData.paymentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Payment Mode:</span>{" "}
                        {challanData.paymentMode}
                      </p>
                    </div>
                  </div>

                  {/* Last Payment Summary */}
                  {challanData.lastPayment && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Last Payment Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Amount Paid:</span> Rs.{" "}
                          {challanData.lastPayment.amount}
                        </div>
                        <div>
                          <span className="font-medium">Months Paid:</span>{" "}
                          {challanData.lastPayment.months?.join(", ") || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Payment Date:</span>{" "}
                          {new Date(
                            challanData.lastPayment.date
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Payment Mode:</span>{" "}
                          {challanData.lastPayment.mode || "Cash"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Fee Details
                    </h3>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left text-sm">
                            Description
                          </th>
                          <th className="border border-gray-300 p-2 text-right text-sm">
                            Amount (Rs.)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2 text-sm">
                            Tuition Fee ({challanData.months?.join(", ")})
                          </td>
                          <td className="border border-gray-300 p-2 text-sm text-right">
                            {challanData.feeBreakdown?.tuitionFee?.toLocaleString()}
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
                            <td className="border border-gray-300 p-2 text-sm text-right">
                              {fee.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}

                        <tr>
                          <td className="border border-gray-300 p-2 text-sm">
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Add custom fee description"
                                className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={newFeeDescription}
                                onChange={(e) =>
                                  setNewFeeDescription(e.target.value)
                                }
                              />
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-sm text-right">
                            <div className="flex items-center justify-end">
                              <input
                                type="number"
                                placeholder="Amount"
                                className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={newFeeAmount}
                                onChange={(e) =>
                                  setNewFeeAmount(e.target.value)
                                }
                              />
                              <button
                                onClick={addNewFee}
                                className="ml-2 text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
                                title="Add Fee"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        <tr className="bg-blue-50">
                          <td className="border border-gray-300 p-2 text-sm font-semibold">
                            Total Amount
                          </td>
                          <td className="border border-gray-300 p-2 text-sm text-right font-semibold">
                            Rs. {calculateChallanTotal().toLocaleString()}
                          </td>
                        </tr>

                        {/* Paid Amount Row */}
                        {challanData.feeBreakdown?.paidAmount && (
                          <tr className="bg-green-50">
                            <td className="border border-gray-300 p-2 text-sm font-semibold text-green-700">
                              Amount Paid
                            </td>
                            <td className="border border-gray-300 p-2 text-sm text-right font-semibold text-green-700">
                              Rs. {calculateChallanTotal().toLocaleString()}
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
                      This challan is generated based on the last payment made
                      on{" "}
                      {challanData.paymentDate
                        ? new Date(challanData.paymentDate).toLocaleDateString()
                        : "N/A"}
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
                  <h2 className="text-xl font-bold text-gray-800">
                    Filter Students
                  </h2>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="All">All Classes</option>
                    {[...new Set(allStudents.map((student) => student.class))]
                      .sort()
                      .map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
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

                {/* Fees Collection Filter Section */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-3">
                    Fees Collection Filter
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Month Filter */}
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Select Month
                      </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">All Months</option>
                        {allMonths.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Current Filter Info */}
                  <div className="mt-3 text-xs">
                    {selectedMonth && selectedDate ? (
                      <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        📅 Showing collection for:{" "}
                        <strong>
                          {selectedMonth} - {formatDisplayDate(selectedDate)}
                        </strong>
                      </div>
                    ) : selectedMonth && !selectedDate ? (
                      <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        📅 Showing collection for:{" "}
                        <strong>Entire {selectedMonth}</strong>
                      </div>
                    ) : !selectedMonth && selectedDate ? (
                      <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        📅 Showing collection for:{" "}
                        <strong>{formatDisplayDate(selectedDate)}</strong>
                      </div>
                    ) : (
                      <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        📊 Showing total collection (All Time)
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMonth("");
                        setSelectedDate("");
                      }}
                      className="text-xs bg-white border border-blue-300 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        setSelectedMonth(
                          today.toLocaleString("default", { month: 'long' })
                        );
                        setSelectedDate(today.toISOString().split("T")[0]);
                      }}
                      className="text-xs bg-blue-100 border border-blue-300 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Today
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedClass("All");
                      setSelectedStatus("All");
                      setSearchTerm("");
                      setSelectedMonth("");
                      setSelectedDate("");
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