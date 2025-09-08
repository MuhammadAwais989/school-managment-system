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
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [allStudents, setAllStudents] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueSections, setUniqueSections] = useState([]);

  const role = localStorage.getItem("role");
  const teacherClass = localStorage.getItem("teacherClass");
  const teacherSection = localStorage.getItem("sectionAssigned");

  // Fetch all students data
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const res = await axios.get(`${BaseURL}/students/details`);
        setAllStudents(res.data || []);
        
        // Extract unique classes and sections
        const classes = [...new Set(res.data.map(std => std.Class))].filter(c => c).sort();
        const sections = [...new Set(res.data.map(std => std.section))].filter(s => s).sort();
        
        setUniqueClasses(classes);
        setUniqueSections(sections);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };
    
    if (role !== "Teacher") {
      fetchAllStudents();
    }
  }, [role]);

  // ✅ Fetch total student count (Class-wise and Section-wise)
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        if (role === "Teacher") {
          // For teachers, use their assigned class and section
          const res = await axios.get(`${BaseURL}/students/details`);
          const filtered = res.data.filter(std => 
            std.Class === teacherClass && 
            std.section === teacherSection
          );
          setStudentList(filtered.length);
        } else {
          // For admin/principal, apply filters if selected
          let filtered = allStudents;
          
          if (classFilter) {
            filtered = filtered.filter(std => std.Class === classFilter);
          }
          
          if (sectionFilter) {
            filtered = filtered.filter(std => std.section === sectionFilter);
          }
          
          setStudentList(filtered.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };
    
    fetchStudentCount();
  }, [role, teacherClass, teacherSection, classFilter, sectionFilter, allStudents]);

  // ✅ Fetch today's attendance summary (Class-wise and Section-wise)
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        let url = `${BaseURL}/students/summary`;
        let params = {};
        
        if (role === "Teacher") {
          params.class = teacherClass;
          params.section = teacherSection;
        } else {
          if (classFilter) params.class = classFilter;
          if (sectionFilter) params.section = sectionFilter;
        }
        
        // Build query string if params exist
        const queryString = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
        
        if (queryString) {
          url += `?${queryString}`;
        }
        
        const res = await axios.get(url);
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
  }, [role, teacherClass, teacherSection, classFilter, sectionFilter]);

  // ✅ Fetch today's attendance student list
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        let url = `${BaseURL}/students/today-attendance`;
        let params = {};
        
        if (role === "Teacher") {
          params.class = teacherClass;
          params.section = teacherSection;
        } else {
          if (classFilter) params.class = classFilter;
          if (sectionFilter) params.section = sectionFilter;
        }
        
        // Build query string if params exist
        const queryString = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
        
        if (queryString) {
          url += `?${queryString}`;
        }
        
        const res = await axios.get(url);
        setTodayAttendance(res.data || []);
      } catch (err) {
        console.error("Failed to fetch today's attendance:", err);
      }
    };
    
    fetchTodayAttendance();
  }, [role, teacherClass, teacherSection, classFilter, sectionFilter]);

  const clearFilters = () => {
    setClassFilter('');
    setSectionFilter('');
  };

  const StudentsData = [
    {
      type: "Total Students",
      count: studentList,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      img: totalStudent,
      cardColor: "from-blue-100/80 via-blue-50 to-white",
      borderColor: "border-blue-200",
      textColor: "text-blue-800"
    },
    {
      type: "Present Students",
      count: attendanceSummary.present,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      img: present,
      cardColor: "from-green-100/80 via-green-50 to-white",
      borderColor: "border-green-200",
      textColor: "text-green-800"
    },
    {
      type: "Absent Students",
      count: attendanceSummary.absent,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      img: absent,
      cardColor: "from-red-100/80 via-red-50 to-white",
      borderColor: "border-red-200",
      textColor: "text-red-800"
    },
    {
      type: "Leave Students",
      count: attendanceSummary.leave,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      img: leave,
      cardColor: "from-yellow-100/80 via-yellow-50 to-white",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800"
    },
  ];

  return (
    <>
      <div className="bg-gray-50 min-h-screen w-full lg:pl-24 pl-4 pt-8 max-sm:pr-1 max-lg:pl-24 max-sm:pt-0 max-sm:pl-3 sm:pt-16">

        {/* Cards */}
        <div className="flex flex-wrap gap-4 mr-4">
          {StudentsData.map((items) => (
            <div
              key={items.type}
              className={`lg:w-[23.8%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24 bg-gradient-to-br ${items.cardColor} border ${items.borderColor} rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center justify-between px-5`}
            >
              <div className={`size-16 rounded-full ${items.bgColor}/50 backdrop-blur-sm border border-white/30 flex justify-center items-center`}>
                <img src={items.img} alt="" className={`size-10 ${items.iconColor} drop-shadow-md`} />
              </div>
              <div className="text-center">
                <h3 className={`font-sans font-semibold ${items.textColor} text-sm`}>{items.type}</h3>
                <h1 className={`font-bold font-sans text-xl ${items.textColor}`}>{items.count}</h1>
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
        {(role === 'Teacher' || classFilter || sectionFilter) && (
          <div className="mt-6 bg-white p-4 rounded-md shadow-sm mr-4">
            <h3 className="font-bold text-lg mb-3">
              Today's Attendance 
              {classFilter && ` - Class ${classFilter}`}
              {sectionFilter && `, Section ${sectionFilter}`}
              {role === 'Teacher' && ` - Class ${teacherClass}, Section ${teacherSection}`}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.length > 0 ? (
                    todayAttendance.map((student) => (
                      <tr key={student._id}>
                        <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.Class}</td>
                        <td className="border border-gray-300 px-4 py-2">{student.section}</td>
                        <td
                          className={`border border-gray-300 px-4 py-2 font-semibold ${student.status === "Present"
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
                        colSpan="4"
                        className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                      >
                        No attendance data for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentCard;