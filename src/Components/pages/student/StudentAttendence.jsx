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

  if (!assignedClass) return;

  let url = `${BaseURL}/students/details?class=${encodeURIComponent(assignedClass)}`;
  if (section) {
    url += `&section=${encodeURIComponent(section)}`;
  }

  axios.get(url)
    .then((res) => {
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

  return (
    <>
      <Sidebar />
      <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full min-h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md pt-6 px-8 max-sm:px-4">
          <div className="p-4">
          <div className="flex items-center justify-between py-4 flex-wrap gap-3">
            <h2 className="text-2x l font-bold ">
              Student Attendance 
            </h2>

              <button
                  onClick={handleSubmit}
                  className="flex items-center bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
                >
                  Submit Attendance
                </button>
            </div>
            
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
                        <th className="border py-2 w-fit">#</th>
                        <th className="border px-4 py-2">Photo</th>
                        <th className="border px-4 py-2">Roll No</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Father Name</th>
                        <th className="border px-4 py-2">Class</th>
                        <th className="border px-4 py-2">Section</th>
                        <th className="border px-4 py-2">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((s, index) => (
                       <tr key={s.studentId} className="text-center">
  <td className="border py-2">{index + 1}</td>
  <td className="border px-2 py-2">
    {s.profilePic ? (
      <img
        src={`${BaseURL}/uploads/${s.profilePic}`} // update path if needed
        alt="student"
        className="w-10 h-10 rounded-full object-cover mx-auto"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto"></div>
    )}
  </td>
  <td className="border px-4 py-2">{s.rollNo}</td>
  <td className="border px-4 py-2">{s.name}</td>
  <td className="border px-4 py-2">{s.fathername}</td>
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

                
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAttendence;
