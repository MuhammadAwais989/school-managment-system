// ✅ StudentCard.jsx

import totalStudent from '../../../assets/images/toal-student-icon.png';
import present from '../../../assets/images/present-student-icon.png';
import absent from '../../../assets/images/absent-student-icon.png';
import leave from '../../../assets/images/leave.png';
import TeacherCard from '../teacher/TeacherCard';
import AccountsMain from '../accounts/AccountsMain';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';

const StudentCard = () => {
  const [studentList, setStudentList] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0
  });
  const [todayAttendance, setTodayAttendance] = useState([]); // 👈 new state

  const role = localStorage.getItem("role");
  const teacherClass = localStorage.getItem("teacherClass");

  // ✅ Fetch total student count (Class-wise)
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await axios.get(`${BaseURL}/students/details`);
        if (role === "Teacher") {
          const filtered = res.data.filter(std => std.Class === teacherClass);
          setStudentList(filtered.length);
        } else {
          setStudentList(res.data.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };

    fetchStudentCount();
  }, [role, teacherClass]);

  // ✅ Fetch today's attendance summary + list (Class-wise)
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        if (role === "Teacher") {
          // Summary
          const resSummary = await axios.get(`${BaseURL}/students/summary?class=${teacherClass}`);
          setAttendanceSummary({
            present: resSummary.data.present || 0,
            absent: resSummary.data.absent || 0,
            leave: resSummary.data.leave || 0,
            total: resSummary.data.total || 0
          });

          // Detailed list
          const resList = await axios.get(`${BaseURL}/students/today-attendance?class=${teacherClass}`);
          setTodayAttendance(resList.data || []);
        } 
      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
      }
    };

    fetchAttendance();
  }, [role, teacherClass]);

  const StudentsData = [
    {
      type: "Total Students",
      count: studentList,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      img: totalStudent,
    },
    {
      type: "Present Students",
      count: attendanceSummary.present,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      img: present,
    },
    {
      type: "Absent Students",
      count: attendanceSummary.absent,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      img: absent,
    },
    {
      type: "Leave Students",
      count: attendanceSummary.leave,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      img: leave,
    },
  ];

  return (
    <div className="bg-gray-50 h-fit w-full lg:pl-24 pl-4 pt-8">
      {/* Summary cards */}
      <div className="flex flex-wrap gap-x-4">
        {StudentsData.map((items) => (
          <div
            key={items.type}
            className="lg:w-[23.8%] w-60 bg-white border rounded-md shadow-sm flex items-center justify-between px-5 mt-2"
          >
            <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
              <img src={items.img} alt="" className={`size-10 ${items.iconColor}`} />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-600">{items.type}</h3>
              <h1 className="font-bold text-xl">{items.count}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* Today's attendance table */}
      <div className="mt-6 bg-white shadow-sm border rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Today's Attendance</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Student Name</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAttendance.length > 0 ? (
              todayAttendance.map((student, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{student.name}</td>
                  <td className={`border p-2 capitalize ${
                    student.status === 'present' ? 'text-green-600' :
                    student.status === 'absent' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {student.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No attendance data found for today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(role === 'Admin' || role === 'Principle') && (
        <>
          <TeacherCard />
          <AccountsMain />
        </>
      )}
    </div>
  );
};

export default StudentCard;
