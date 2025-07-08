// ReportModal.jsx
import React from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';


const ReportModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(16);
  doc.text(title, pageWidth / 2, 15, { align: 'center' });

  // Table headers
  const headers = [
    'Roll No',
    'Name',
    'Father Name',
    'Class',
    'Section',
    'Total Present',
    'Total Absent',
    'Total Leave',
  ];

  const startX = 10;
  let startY = 25;

  // Draw table headers
  doc.setFontSize(10);
  headers.forEach((header, index) => {
    doc.text(header, startX + index * 25, startY);
  });

  startY += 10;

  // Draw student rows
  data.forEach((student) => {
    const row = [
      student.rollNo || '-',
      student.name || '-',
      student.fathername || '-',
      student.class || '-',
      student.section || '-',
      String(student.totalPresent || 0),
      String(student.totalAbsent || 0),
      String(student.totalLeave || 0),
    ];

    row.forEach((item, idx) => {
      doc.text(item, startX + idx * 25, startY);
    });

    startY += 10;
  });

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
              <tr>
                <th className="border px-2 py-1">Roll No</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Father Name</th>
                <th className="border px-2 py-1">Class</th>
                <th className="border px-2 py-1">Section</th>
                <th className="border px-2 py-1">Present Dates</th>
                <th className="border px-2 py-1">Absent Dates</th>
                <th className="border px-2 py-1">Leave Dates</th>
                <th className="border px-2 py-1">Total Present</th>
                <th className="border px-2 py-1">Total Absent</th>
                <th className="border px-2 py-1">Total Leave</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1">{s.rollNo}</td>
                  <td className="border px-2 py-1">{s.name}</td>
                  <td className="border px-2 py-1">{s.fathername}</td>
                  <td className="border px-2 py-1">{s.class}</td>
                  <td className="border px-2 py-1">{s.section}</td>
                  <td className="border px-2 py-1 whitespace-pre-wrap text-left">{s.presentDates?.join(', ') || '-'}</td>
                  <td className="border px-2 py-1 whitespace-pre-wrap text-left">{s.absentDates?.join(', ') || '-'}</td>
                  <td className="border px-2 py-1 whitespace-pre-wrap text-left">{s.leaveDates?.join(', ') || '-'}</td>
                  <td className="border px-2 py-1">{s.totalPresent || 0}</td>
                  <td className="border px-2 py-1">{s.totalAbsent || 0}</td>
                  <td className="border px-2 py-1">{s.totalLeave || 0}</td>
                </tr>
              ))}
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
