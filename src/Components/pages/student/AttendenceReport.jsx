import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportModal = ({ isOpen, onClose, title, data, mode, reportType = 'teacher' }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });

    if (mode === 'summary') {
      if (reportType === 'teacher') {
        // Teacher summary report table
        doc.autoTable({
          startY: 25,
          head: [['ID', 'Name', 'Designation', 'Class', 'Section', 'Present', 'Absent', 'Leave', 'Percentage']],
          body: data.map(item => [
            item.staffId || item.teacherId || '-',
            item.name || '-',
            item.designation || '-',
            item.class || '-',
            item.section || '-',
            item.presentDays || item.present || 0,
            item.absentDays || item.absent || 0,
            item.leaveDays || item.leave || 0,
            `${item.attendancePercentage || 0}%`
          ])
        });
      } else {
        // Student summary report table
        doc.autoTable({
          startY: 25,
          head: [['Roll No', 'Name', 'Father Name', 'Class', 'Section', 'Present', 'Absent', 'Leave']],
          body: data.map(item => [
            item.rollNo || '-',
            item.name || '-',
            item.fathername || '-',
            item.class || '-',
            item.section || '-',
            item.present || 0,
            item.absent || 0,
            item.leave || 0
          ])
        });
      }
    } else {
      // Detail report
      if (reportType === 'teacher') {
        // Teacher detail report table
        const detailData = [];
        
        data.forEach(item => {
          if (item.records && Array.isArray(item.records)) {
            item.records.forEach(record => {
              detailData.push([
                item.staffId || item.teacherId || '-',
                item.name || '-',
                item.designation || '-',
                item.class || '-',
                item.section || '-',
                record.date || '-',
                record.status || '-'
              ]);
            });
          } else {
            // Handle single record case
            detailData.push([
              item.staffId || item.teacherId || '-',
              item.name || '-',
              item.designation || '-',
              item.class || '-',
              item.section || '-',
              item.date || '-',
              item.status || '-'
            ]);
          }
        });

        doc.autoTable({
          startY: 25,
          head: [['ID', 'Name', 'Designation', 'Class', 'Section', 'Date', 'Status']],
          body: detailData
        });
      } else {
        // Student detail report table - FIXED for individual student reports
        const detailData = [];
        
        // Check if this is a single student report (has date arrays)
        const isSingleStudentReport = data.length === 1 && 
          (data[0].presentDates || data[0].absentDates || data[0].leaveDates);
        
        if (isSingleStudentReport) {
          // Single student report with date arrays
          const student = data[0];
          const allDates = [
            ...(student.presentDates || []).map(date => ({ date, status: 'Present' })),
            ...(student.absentDates || []).map(date => ({ date, status: 'Absent' })),
            ...(student.leaveDates || []).map(date => ({ date, status: 'Leave' })),
          ];
          
          allDates.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          allDates.forEach(entry => {
            detailData.push([
              student.rollNo || '-',
              student.name || '-',
              student.fathername || '-',
              student.class || '-',
              student.section || '-',
              entry.date || '-',
              entry.status || '-'
            ]);
          });
        } else {
          // Multiple students with records array or other format
          data.forEach(student => {
            if (student.records && Array.isArray(student.records)) {
              // Multiple students with records array
              student.records.forEach(record => {
                detailData.push([
                  student.rollNo || '-',
                  student.name || '-',
                  student.fathername || '-',
                  student.class || '-',
                  student.section || '-',
                  record.date || '-',
                  record.status || '-'
                ]);
              });
            } else if (student.date) {
              // Single record case
              detailData.push([
                student.rollNo || '-',
                student.name || '-',
                student.fathername || '-',
                student.class || '-',
                student.section || '-',
                student.date || '-',
                student.status || '-'
              ]);
            }
          });
        }

        doc.autoTable({
          startY: 25,
          head: [['Roll No', 'Name', 'Father Name', 'Class', 'Section', 'Date', 'Status']],
          body: detailData
        });
      }
    }

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
  };

  // Determine table headers and data based on report type and mode
  const getTableHeaders = () => {
    if (reportType === 'teacher') {
      return mode === 'summary' ? (
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Designation</th>
          <th className="border px-2 py-1">Class</th>
          <th className="border px-2 py-1">Section</th>
          <th className="border px-2 py-1">Present</th>
          <th className="border px-2 py-1">Absent</th>
          <th className="border px-2 py-1">Leave</th>
          <th className="border px-2 py-1">Percentage</th>
        </tr>
      ) : (
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Designation</th>
          <th className="border px-2 py-1">Class</th>
          <th className="border px-2 py-1">Section</th>
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      );
    } else {
      return mode === 'summary' ? (
        <tr>
          <th className="border px-2 py-1">Roll No</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Father Name</th>
          <th className="border px-2 py-1">Class</th>
          <th className="border px-2 py-1">Section</th>
          <th className="border px-2 py-1">Present</th>
          <th className="border px-2 py-1">Absent</th>
          <th className="border px-2 py-1">Leave</th>
        </tr>
      ) : (
        <tr>
          <th className="border px-2 py-1">Roll No</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Father Name</th>
          <th className="border px-2 py-1">Class</th>
          <th className="border px-2 py-1">Section</th>
          <th className="border px-2 py-1">Date</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      );
    }
  };

  const renderTableData = () => {
    if (reportType === 'teacher') {
      if (mode === 'summary') {
        return data.map((item, idx) => (
          <tr key={idx} className="text-center">
            <td className="border px-2 py-1">{item.staffId || item.teacherId || '-'}</td>
            <td className="border px-2 py-1">{item.name || '-'}</td>
            <td className="border px-2 py-1">{item.designation || '-'}</td>
            <td className="border px-2 py-1">{item.class || '-'}</td>
            <td className="border px-2 py-1">{item.section || '-'}</td>
            <td className="border px-2 py-1">{item.presentDays || item.present || 0}</td>
            <td className="border px-2 py-1">{item.absentDays || item.absent || 0}</td>
            <td className="border px-2 py-1">{item.leaveDays || item.leave || 0}</td>
            <td className="border px-2 py-1">{item.attendancePercentage || 0}%</td>
          </tr>
        ));
      } else {
        return data.flatMap((item, idx) => {
          if (item.records && Array.isArray(item.records)) {
            return item.records.map((record, recordIdx) => (
              <tr key={`${idx}-${recordIdx}`} className="text-center">
                <td className="border px-2 py-1">{item.staffId || item.teacherId || '-'}</td>
                <td className="border px-2 py-1">{item.name || '-'}</td>
                <td className="border px-2 py-1">{item.designation || '-'}</td>
                <td className="border px-2 py-1">{item.class || '-'}</td>
                <td className="border px-2 py-1">{item.section || '-'}</td>
                <td className="border px-2 py-1">{record.date || '-'}</td>
                <td className="border px-2 py-1">{record.status || '-'}</td>
              </tr>
            ));
          } else {
            return (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">{item.staffId || item.teacherId || '-'}</td>
                <td className="border px-2 py-1">{item.name || '-'}</td>
                <td className="border px-2 py-1">{item.designation || '-'}</td>
                <td className="border px-2 py-1">{item.class || '-'}</td>
                <td className="border px-2 py-1">{item.section || '-'}</td>
                <td className="border px-2 py-1">{item.date || '-'}</td>
                <td className="border px-2 py-1">{item.status || '-'}</td>
              </tr>
            );
          }
        });
      }
    } else {
      if (mode === 'summary') {
        return data.map((s, idx) => (
          <tr key={idx} className="text-center">
            <td className="border px-2 py-1">{s.rollNo || '-'}</td>
            <td className="border px-2 py-1">{s.name || '-'}</td>
            <td className="border px-2 py-1">{s.fathername || '-'}</td>
            <td className="border px-2 py-1">{s.class || '-'}</td>
            <td className="border px-2 py-1">{s.section || '-'}</td>
            <td className="border px-2 py-1">{s.present || 0}</td>
            <td className="border px-2 py-1">{s.absent || 0}</td>
            <td className="border px-2 py-1">{s.leave || 0}</td>
          </tr>
        ));
      } else {
        // Check if this is a single student report (has date arrays)
        const isSingleStudentReport = data.length === 1 && 
          (data[0].presentDates || data[0].absentDates || data[0].leaveDates);
        
        if (isSingleStudentReport) {
          // Single student report with date arrays
          const student = data[0];
          const allDates = [
            ...(student.presentDates || []).map(date => ({ date, status: 'Present' })),
            ...(student.absentDates || []).map(date => ({ date, status: 'Absent' })),
            ...(student.leaveDates || []).map(date => ({ date, status: 'Leave' })),
          ];
          
          allDates.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          return allDates.map((entry, i) => (
            <tr key={`${i}`} className="text-center">
              <td className="border px-2 py-1">{student.rollNo || '-'}</td>
              <td className="border px-2 py-1">{student.name || '-'}</td>
              <td className="border px-2 py-1">{student.fathername || '-'}</td>
              <td className="border px-2 py-1">{student.class || '-'}</td>
              <td className="border px-2 py-1">{student.section || '-'}</td>
              <td className="border px-2 py-1">{entry.date || '-'}</td>
              <td className="border px-2 py-1">{entry.status || '-'}</td>
            </tr>
          ));
        } else {
          // Multiple students with records array or other format
          return data.flatMap((s, idx) => {
            if (s.records && Array.isArray(s.records)) {
              // Multiple students with records array
              return s.records.map((record, i) => (
                <tr key={`${idx}-${i}`} className="text-center">
                  <td className="border px-2 py-1">{s.rollNo || '-'}</td>
                  <td className="border px-2 py-1">{s.name || '-'}</td>
                  <td className="border px-2 py-1">{s.fathername || '-'}</td>
                  <td className="border px-2 py-1">{s.class || '-'}</td>
                  <td className="border px-2 py-1">{s.section || '-'}</td>
                  <td className="border px-2 py-1">{record.date || '-'}</td>
                  <td className="border px-2 py-1">{record.status || '-'}</td>
                </tr>
              ));
            } else if (s.date) {
              // Single record case
              return (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1">{s.rollNo || '-'}</td>
                  <td className="border px-2 py-1">{s.name || '-'}</td>
                  <td className="border px-2 py-1">{s.fathername || '-'}</td>
                  <td className="border px-2 py-1">{s.class || '-'}</td>
                  <td className="border px-2 py-1">{s.section || '-'}</td>
                  <td className="border px-2 py-1">{s.date || '-'}</td>
                  <td className="border px-2 py-1">{s.status || '-'}</td>
                </tr>
              );
            } else {
              // Fallback for unexpected data format
              return (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1" colSpan="7">No attendance data available</td>
                </tr>
              );
            }
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[95%] md:w-[90%] lg:w-[80%] h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            className="text-red-600 font-semibold hover:underline"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="overflow-auto max-h-[70vh]">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-center">
              {getTableHeaders()}
            </thead>
            <tbody>
              {renderTableData()}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;