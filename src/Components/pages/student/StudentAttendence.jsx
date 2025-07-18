import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper';
import Sidebar from '../sidebar/SideBar';
import ReportModal from './AttendenceReport';
import { showError, showSuccess } from '../../utils/Toast';
import { FaSearch } from 'react-icons/fa';

const StudentAttendence = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Attendance Report');
  const [modalData, setModalData] = useState([]);
  const [modalMode, setModalMode] = useState('detail');

  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // ✅ confirm modal state

  useEffect(() => {
    const assignedClass = localStorage.getItem("classAssigned");

    if (!assignedClass) return;

    const url = `${BaseURL}/students/details?class=${encodeURIComponent(assignedClass)}`;

    axios.get(url)
      .then((res) => {
        if (!res.data || res.data.length === 0) {
          setStudents([]);
          setFilteredStudents([]);
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
        setFilteredStudents(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching filtered students:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = students.filter((s) => s.name.toLowerCase().includes(lowerSearch));
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleStatusChange = (index, value) => {
    const updated = [...filteredStudents];
    updated[index].status = value;
    setFilteredStudents(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date: today,
        records: filteredStudents.map(({ studentId, status, class: cls, section }) => ({
          studentId,
          status,
          class: cls,
          section
        }))
      };

      await axios.post(`${BaseURL}/students/attendence`, payload);
      showSuccess("Attendance marked successfully");
    } catch (err) {
      console.error("Attendance submit error:", err);
      showError("Error marking attendance");
    } finally {
      setShowConfirmPopup(false); // close popup after response
    }
  };

  const handleReportSelect = async (studentId, reportType) => {
    try {
      const response = await axios.get(`${BaseURL}/students/attendence?studentId=${studentId}&type=${reportType}`);
      setModalTitle(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`);
      setModalData([response.data]);
      setModalMode("detail");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching report:", err);
      showError("Failed to fetch report.");
    }
  };

  const handleClassReport = async (type) => {
    try {
      const assignedClass = localStorage.getItem("classAssigned");

      const response = await axios.get(`${BaseURL}/students/class/report`, {
        params: {
          class: assignedClass,
          type: type,
        },
      });

      setModalTitle(`${assignedClass} - ${type} Report`);
      setModalData(response.data);
      setModalMode("summary");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching class report:", err);
      showError("Failed to fetch class report.");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full h-screen">
        <div className="bg-white w-full h-full shadow-md rounded-md px-4 max-sm:px-4">
          <div className="flex items-center justify-between py-4 flex-wrap gap-3">
            {/* Search Input */}
            <div className="flex items-center bg-[#F8F8F8] rounded px-3 py-2 flex-grow w-10 max-sm:w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search By Name"
                className="outline-none bg-[#F8F8F8] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Report and Submit */}
            <div className="flex gap-3 max-sm:w-full justify-end">
              <select
                onChange={(e) => handleClassReport(e.target.value)}
                className="border cursor-pointer border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 hover:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 max-sm:text-sm"
                defaultValue=""
              >
                <option value="" disabled>Select Report</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="previous">Previous Month</option>
                <option value="yearly">Yearly</option>
              </select>

              <button
                onClick={() => setShowConfirmPopup(true)} // ✅ open confirm modal
                className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 max-sm:text-sm"
              >
                Submit Attendance
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="overflow-x-auto h-[calc(100vh-155px)] max-sm:h-[calc(100vh-160px)] scrollbar-hide">
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
                  {filteredStudents.map((s, index) => (
                    <tr key={s.studentId} className="text-center">
                      <td className="border py-2 text-gray-400">{index + 1}</td>
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
                          <option value="yearly">Yearly</option>
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

      {/* Report Modal */}
      <ReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        data={modalData}
        mode={modalMode}
      />

      {/* ✅ Confirm Submit Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white  rounded-xl shadow-2xl w-[90%] max-w-md p-6 text-center animate-fade-in">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-rose-600 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 3.75c-4.556 0-8.25 3.694-8.25 8.25s3.694 8.25 8.25 8.25 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Attendance Submission
              </h2>
              <p className="text-sm text-gray-600">
                Are you sure you want to submit <span className="font-semibold text-rose-600">today's attendance</span>?
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg transition duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default StudentAttendence;
