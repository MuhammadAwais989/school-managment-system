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

  const role = localStorage.getItem("role"); 

  // Fetch total student count
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(`${BaseURL}/students/details`);
        const count = response.data?.length || 0;
        setStudentList(count);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };

    fetchStudentCount();
  }, []);

  // Fetch today's attendance summary
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const res = await axios.get(`${BaseURL}/`);
        setAttendanceSummary({
          present: res.data.present || 0,
          absent: res.data.absent || 0,
          leave: res.data.leave || 0,
          total: res.data.total || 0
        });
      } catch (err) {
        console.error("Failed to fetch today's attendance summary:", err);
      }
    };

    fetchAttendanceSummary();
  }, []);

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
      <div className="bg-gray-50 h-fit w-full lg:pl-28 pl-4 pt-8 max-sm:pr-1 max-lg:pl-24 max-sm:pt-0 max-sm:pl-3 sm:pt-16 flex flex-wrap gap-x-4">
        {StudentsData.map((items) => (
          <div
            key={items.type}
            className="lg:w-[23%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24 bg-white rounded-md shadow-md flex items-center justify-between px-5 mt-8"
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

        {/* Only show for admin or principal */}
        {(role === 'Admin' || role === 'Principle') && (
          <>
            <TeacherCard />
            <AccountsMain />
          </>
        )}
      </div>
    </>
  );
};

export default StudentCard;
