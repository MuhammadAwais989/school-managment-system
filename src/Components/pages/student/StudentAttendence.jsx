import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';

const StudentAttendence = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const assignedClass = localStorage.getItem("classAssigned");
  const assignedSection = localStorage.getItem("sectionAssigned");
  const role = localStorage.getItem("role");

useEffect(() => {
  const assignedClass = localStorage.getItem("classAssigned");
  const section = localStorage.getItem("sectionAssigned");

  if (!assignedClass) return; // Don't fetch if class is not defined

  let url = `${BaseURL}/students/details?class=${encodeURIComponent(assignedClass)}`;
  if (section) {
    url += `&section=${encodeURIComponent(section)}`;
  }

  axios.get(url)
    .then((res) => {
      const formatted = res.data.map((s) => ({
        studentId: s._id,
        name: s.name,
        class: s.Class,
        section: s.section,
        status: "present"
      }));
      setStudents(formatted);
    })
    .catch((err) => {
      console.error("Error fetching filtered students:", err);
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

  return (
    <>
      <Sidebar />
      <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md pt-6 px-8 max-sm:px-4">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
              Student Attendance - {today}
            </h2>

            {loading ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <p>No students found for your class/section.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-gray-100 text-center">
                      <tr>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Class</th>
                        <th className="border px-4 py-2">Section</th>
                        <th className="border px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, index) => (
                        <tr key={s.studentId} className="text-center">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{s.name}</td>
                          <td className="border px-4 py-2">{s.class}</td>
                          <td className="border px-4 py-2">{s.section}</td>
                          <td className="border px-4 py-2">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Attendance
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAttendence;
