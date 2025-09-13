import React from 'react';
import jsPDF from 'jspdf';

const TeacherReportModal = ({ isOpen, onClose, title, data, mode }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });

    const startX = 10;
    let startY = 25;

    if (mode === 'summary') {
      // Teacher summary report headers
      const headers = ['Name', 'Father Name', 'Designation', 'Class', 'Section', 'Present', 'Absent', 'Leave', 'Percentage'];
      doc.setFontSize(8); // Smaller font to fit all columns
      
      // Adjust column positions for teacher data
      const positions = [startX, startX + 25, startX + 50, startX + 70, startX + 85, startX + 100, startX + 115, startX + 130, startX + 145];
      
      headers.forEach((header, index) => {
        doc.text(header, positions[index], startY);
      });
      
      startY += 10;

      data.forEach((teacher) => {
        const row = [
          teacher.name || '-',
          teacher.fatherName || '-', // Handle different field names
          teacher.designation || '-',
          teacher.class || '-',
          teacher.section || '-',
          teacher.presentDays || teacher.present || '0',
          teacher.absentDays || teacher.absent || '0',
          teacher.leaveDays || teacher.leave || '0',
          `${teacher.attendancePercentage || 0}%`
        ];

        row.forEach((item, idx) => {
          doc.text(String(item), positions[idx], startY);
        });

        startY += 10;
        if (startY > 280) {
          doc.addPage();
          startY = 20;
        }
      });
    } else {
      // Teacher detail report
      const headers = ['Name', 'Father Name', 'Designation', 'Class', 'Section', 'Date', 'Status'];
      doc.setFontSize(9); // Slightly smaller font for detail view
      
      // Adjust column positions for teacher detail data
      const positions = [startX, startX + 30, startX + 60, startX + 85, startX + 100, startX + 120, startX + 150];
      
      headers.forEach((header, index) => {
        doc.text(header, positions[index], startY);
      });
      
      startY += 10;

      data.forEach((teacher) => {
        const baseInfo = [
          teacher.name || '-',
          teacher.fatherName || '-', // Handle different field names
          teacher.designation || '-',
          teacher.class || '-',
          teacher.section || '-',
        ];

        // Handle different data structures from API responses
        const allDates = teacher.records 
          ? teacher.records.map(record => ({ date: record.date, status: record.status }))
          : [
              ...(teacher.presentDates || []).map((date) => ({ date, status: 'Present' })),
              ...(teacher.absentDates || []).map((date) => ({ date, status: 'Absent' })),
              ...(teacher.leaveDates || []).map((date) => ({ date, status: 'Leave' })),
            ];

        allDates.sort((a, b) => new Date(a.date) - new Date(b.date));

        allDates.forEach((entry) => {
          const row = [...baseInfo, entry.date, entry.status];
          
          row.forEach((item, idx) => {
            doc.text(String(item), positions[idx], startY);
          });
          
          startY += 10;
          if (startY > 280) {
            doc.addPage();
            startY = 20;
          }
        });
      });
    }

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
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
              {mode === 'summary' ? (
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Father Name</th>
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
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Father Name</th>
                  <th className="border px-2 py-1">Designation</th>
                  <th className="border px-2 py-1">Class</th>
                  <th className="border px-2 py-1">Section</th>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {mode === 'summary'
                ? data.map((t, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-2 py-1">{t.name}</td>
                    <td className="border px-2 py-1">{t.fatherName || '-'}</td>
                    <td className="border px-2 py-1">{t.designation}</td>
                    <td className="border px-2 py-1">{t.class}</td>
                    <td className="border px-2 py-1">{t.section}</td>
                    <td className="border px-2 py-1">{t.presentDays || t.present || '0'}</td>
                    <td className="border px-2 py-1">{t.absentDays || t.absent || '0'}</td>
                    <td className="border px-2 py-1">{t.leaveDays || t.leave || '0'}</td>
                    <td className="border px-2 py-1">{t.attendancePercentage ? `${t.attendancePercentage}%` : '0%'}</td>
                  </tr>
                ))
                : data.map((t, idx) => {
                  // Handle different data structures from API responses
                  const allDates = t.records 
                    ? t.records.map(record => ({ date: record.date, status: record.status }))
                    : [
                        ...(t.presentDates || []).map(date => ({ date, status: 'Present' })),
                        ...(t.absentDates || []).map(date => ({ date, status: 'Absent' })),
                        ...(t.leaveDates || []).map(date => ({ date, status: 'Leave' })),
                      ];
                  
                  allDates.sort((a, b) => new Date(a.date) - new Date(b.date));
                  
                  return allDates.map((entry, i) => (
                    <tr key={`${idx}-${i}`} className="text-center">
                      <td className="border px-2 py-1">{t.name}</td>
                      <td className="border px-2 py-1">{t.fatherName || '-'}</td>
                      <td className="border px-2 py-1">{t.designation}</td>
                      <td className="border px-2 py-1">{t.class}</td>
                      <td className="border px-2 py-1">{t.section}</td>
                      <td className="border px-2 py-1">{entry.date}</td>
                      <td className="border px-2 py-1">{entry.status}</td>
                    </tr>
                  ));
                })}
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

export default TeacherReportModal;