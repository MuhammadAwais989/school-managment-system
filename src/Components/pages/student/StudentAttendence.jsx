import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar'


const StudentAttendence = () => {
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const today = new Date().toISOString().split('T')[0];

    //   useEffect(() => {
    //     // Fetch students from backend
    //     axios.get(`${BaseURL}/students`).then(res => {
    //       const initialData = res.data.map(s => ({
    //         studentId: s._id,
    //         name: s.name,
    //         class: s.class,
    //         section: s.section,
    //         status: "present"
    //       }));
    //       setStudents(initialData);
    //     });
    //   }, []);

    const handleStatusChange = (index, value) => {
        const updated = [...students];
        updated[index].status = value;
        setStudents(updated);
    };

    const handleSubmit = () => {
        const payload = {
            date: today,
            records: students.map(({ studentId, status, class: cls, section }) => ({
                studentId,
                status,
                class: cls,
                section
            }))
        };

        axios.post(`${BaseURL}/attendance/mark`, payload)
            .then(() => alert("Attendance marked successfully"))
            .catch(err => alert("Error marking attendance"));
    };
    return (
        <>
            <Sidebar />
            <div className="lg:pl-24 pt-24 max-md:pr-4 pr-9 pb-4 max-sm:pt-1 max-sm:pl-4 max-sm:pr-5 max-lg:pt-24 max-lg:pl-24 bg-gray-50 w-full h-screen">
                <div className="bg-white w-full h-full shadow-md rounded-md pt-6 px-8 max-sm:px-4">
                    <div className="p-4">
                        <h2 className="text-2xl font-bold mb-4">Student Attendance - {today}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border border-gray-300">
                                <thead className="bg-gray-100">
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
                                        <tr key={index} className="text-center">
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentAttendence