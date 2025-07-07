// StudentAttendence.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';
import ReportModal from './AttendenceReport';

const StudentAttendence = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Attendance Report');
  const [modalData, setModalData] = useState([]);

 useEffect(() => {
  const assignedClass = localStorage.getItem("classAssigned");

  if (!assignedClass) return;

  const url = `${BaseURL}/students/details?class=${encodeURIComponent(assignedClass)}`;

  axios.get(url)
    .then((res) => {
      if (!res.data || res.data.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const formatted = res.data.map((s) => ({
        studentId: s._id,
        rollNo: s.rollNo || '',
        profilePic: s.studentPic || '',
        name: s.name,
        fathername: s.fatherName,
        class: s.Class,
        section: s.section,
        status: "present"
      }));

      setStudents(formatted);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching filtered students:", err);
      setLoading(false);
    });
}, []);


  const handleStatusChange = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date: today,
        records: students.map(({ studentId, status, class: cls, section }) => ({
          studentId,
          status,
          class: cls,
          section
        }))
      };

      await axios.post(`${BaseURL}/attendance/mark`, payload);
      alert("Attendance marked successfully");
    } catch (err) {
      console.error("Attendance submit error:", err);
      alert("Error marking attendance");
    }
  };

  const handleReportSelect = async (studentId, reportType) => {
    try {
      const response = await axios.get(`${BaseURL}/attendance/report?studentId=${studentId}&type=${reportType}`);
      setModalTitle(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`);
      setModalData([response.data]);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Failed to fetch report.");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-8 max-sm:px-4">
          <div className="p-4">
            <div className="flex items-center justify-between py-4 flex-wrap gap-3">
              <h2 className="text-2xl font-bold">Student Attendance</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
                >
                  Submit Attendance
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <p>No students found for your class/section.</p>
            ) : (
              <div className="overflow-x-auto h-[calc(100vh-220px)] max-sm:h-[calc(100vh-160px)] scrollbar-hide">
                <table className="min-w-full table-auto border border-gray-300">
                  <thead className="bg-gray-100 text-gray-700 text-sm font-semibold text-center">
                    <tr>
                      <th className="border py-3 px-1 whitespace-nowrap"></th>
                      <th className="border py-3 px-1 whitespace-nowrap">Photo</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Roll No</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Name</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Father Name</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Class</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Section</th>
                      <th className="border py-3 px-1 whitespace-nowrap">Status</th>
                      <th className="border py-0 px-1 whitespace-nowrap">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, index) => (
                      <tr key={s.studentId} className="text-center">
                        <td className="border py-2">{index + 1}</td>
                        <td className="border px-2 py-2">
                          <img
                            src={s.profilePic}
                            alt="student"
                            className="w-10 h-10 rounded-full object-cover mx-auto"
                          />
                        </td>
                        <td className="border px-3 py-0 truncate w-fit">{s.rollNo}</td>
                        <td className="border px-3 py-0">{s.name}</td>
                        <td className="border px-3 py-0">{s.fathername}</td>
                        <td className="border px-3 py-0">{s.class}</td>
                        <td className="border px-3 py-0">{s.section}</td>
                        <td className="border px-3 py-0">
                          <select
                            className="border rounded px-2 py-1"
                            value={s.status}
                            onChange={(e) => handleStatusChange(index, e.target.value)}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="leave">Leave</option>
                          </select>
                        </td>
                        <td className="border px-0 py-0 truncate w-fit">
                          <select
                            onChange={(e) => handleReportSelect(s.studentId, e.target.value)}
                            className="border px-0 py-2 rounded-md"
                            defaultValue=""
                          >
                            <option value="" disabled>Select Report</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="previous">Previous Month</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        data={modalData}
      />
    </>
  );
};

export default StudentAttendence;