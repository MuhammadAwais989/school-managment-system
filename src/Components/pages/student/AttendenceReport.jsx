import React from 'react';
import jsPDF from 'jspdf';

const ReportModal = ({ isOpen, onClose, title, data, mode }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });

    const startX = 10;
    let startY = 25;

    if (mode === 'summary') {
      const headers = ['Roll No', 'Name', 'Father Name', 'Class', 'Section', 'Present', 'Absent', 'Leave'];
      doc.setFontSize(10);
      headers.forEach((header, index) => {
        doc.text(header, startX + index * 25, startY);
      });
      startY += 10;

      data.forEach((student) => {
        const row = [
          student.rollNo,
          student.name,
          student.fathername,
          student.class,
          student.section,
          student.present,
          student.absent,
          student.leave
        ];

        row.forEach((item, idx) => {
          doc.text(String(item), startX + idx * 25, startY);
        });

        startY += 10;
        if (startY > 280) {
          doc.addPage();
          startY = 20;
        }
      });
    } else {
      // Detail Report
      const headers = ['Roll No', 'Name', 'Father Name', 'Class', 'Section', 'Date', 'Status'];
      doc.setFontSize(10);
      headers.forEach((header, index) => {
        doc.text(header, startX + index * 25, startY);
      });
      startY += 10;

      data.forEach((student) => {
        const baseInfo = [
          student.rollNo || '-',
          student.name || '-',
          student.fathername || '-',
          student.class || '-',
          student.section || '-',
        ];

        const allDates = [
          ...(student.presentDates || []).map((date) => ({ date, status: 'Present' })),
          ...(student.absentDates || []).map((date) => ({ date, status: 'Absent' })),
          ...(student.leaveDates || []).map((date) => ({ date, status: 'Leave' })),
        ];

        allDates.sort((a, b) => new Date(a.date) - new Date(b.date));

        allDates.forEach((entry) => {
          const row = [...baseInfo, entry.date, entry.status];
          row.forEach((item, idx) => {
            doc.text(String(item), startX + idx * 25, startY);
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
              )}
            </thead>
            <tbody>
              {mode === 'summary'
                ? data.map((s, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-2 py-1">{s.rollNo}</td>
                    <td className="border px-2 py-1">{s.name}</td>
                    <td className="border px-2 py-1">{s.fathername}</td>
                    <td className="border px-2 py-1">{s.class}</td>
                    <td className="border px-2 py-1">{s.section}</td>
                    <td className="border px-2 py-1">{s.present}</td>
                    <td className="border px-2 py-1">{s.absent}</td>
                    <td className="border px-2 py-1">{s.leave}</td>
                  </tr>
                ))
                : data.map((s, idx) => {
                  const allDates = [
                    ...(s.presentDates || []).map(date => ({ date, status: 'Present' })),
                    ...(s.absentDates || []).map(date => ({ date, status: 'Absent' })),
                    ...(s.leaveDates || []).map(date => ({ date, status: 'Leave' })),
                  ];
                  allDates.sort((a, b) => new Date(a.date) - new Date(b.date));
                  return allDates.map((entry, i) => (
                    <tr key={`${idx}-${i}`} className="text-center">
                      <td className="border px-2 py-1">{s.rollNo}</td>
                      <td className="border px-2 py-1">{s.name}</td>
                      <td className="border px-2 py-1">{s.fathername}</td>
                      <td className="border px-2 py-1">{s.class}</td>
                      <td className="border px-2 py-1">{s.section}</td>
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

export default ReportModal;