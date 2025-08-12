import totalStudent from '../../../assets/images/toal-student-icon.png';
import present from '../../../assets/images/present-student-icon.png';
import absent from '../../../assets/images/absent-student-icon.png';
import leave from '../../../assets/images/leave.png';
import TeacherCard from '../teacher/TeacherCard';
import AccountsMain from '../accounts/AccountsMain';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';

const StudentCard = () => {
  const [studentList, setStudentList] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0
  });
  const [todayAttendance, setTodayAttendance] = useState([]);

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

  // ✅ Fetch today's attendance summary (Class-wise)
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        if (role === "Teacher") {
          const res = await axios.get(`${BaseURL}/students/summary?class=${teacherClass}`);
          setAttendanceSummary({
            present: res.data.present || 0,
            absent: res.data.absent || 0,
            leave: res.data.leave || 0,
            total: res.data.total || 0
          });
        } else {
          const res = await axios.get(`${BaseURL}/`);
          setAttendanceSummary({
            present: res.data.present || 0,
            absent: res.data.absent || 0,
            leave: res.data.leave || 0,
            total: res.data.total || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch today's attendance summary:", err);
      }
    };
    fetchAttendanceSummary();
  }, [role, teacherClass]);

  // ✅ Fetch today's attendance student list
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        if (role === "Teacher") {
          const res = await axios.get(`${BaseURL}/students/today-attendance?class=${teacherClass}`);
          setTodayAttendance(res.data || []);
        } else {
          const res = await axios.get(`${BaseURL}/students/today-attendance`);
          setTodayAttendance(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
      }
    };
    fetchTodayAttendance();
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
    <>
    
    <div className="bg-gray-50 h-fit w-full lg:pl-24 pl-4 pt-8 max-sm:pr-1 max-lg:pl-24 max-sm:pt-0 max-sm:pl-3 sm:pt-16">
      {/* Cards */}
      <div className="flex flex-wrap gap-x-4">
        {StudentsData.map((items) => (
          <div
            key={items.type}
            className="lg:w-[23.8%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-between px-5 mt-2"
          >
            <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
              <img src={items.img} alt="" className={`size-10 ${items.iconColor}`} />
            </div>
            <div className="text-center">
              <h3 className="font-sans font-semibold text-gray-600">{items.type}</h3>
              <h1 className="font-bold font-sans text-xl">{items.count}</h1>
            </div>
          </div>
        ))}

        {(role === 'Admin' || role === 'Principle') && (
          <>
            <TeacherCard />
            <AccountsMain />
          </>
        )}
      </div>

      {/* Today's Attendance Table */}
      {(role === 'Teacher') &&(

      <div className="mt-6 bg-white p-4 rounded-md shadow-sm">
        <h3 className="font-bold text-lg mb-3">Today's Attendance</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAttendance.length > 0 ? (
              todayAttendance.map((student) => (
                <tr key={student._id}>
                  <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-semibold ${
                      student.status === "Present"
                        ? "text-green-600"
                        : student.status === "Absent"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {student.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No attendance data for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

    </div>
    </>
  );
};

export default StudentCard;
