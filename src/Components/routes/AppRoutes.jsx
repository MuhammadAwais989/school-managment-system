import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherDashoard from '../pages/teacher/TeacherDashboard';
import AddAccount from '../pages/addAccount/AddAccount';
import TeacherDetails from '../pages/teacher/TeacherDetails';
import Login from '../pages/Login';
import StudentAttendence from '../pages/student/StudentAttendence';
import StudentDetails from '../pages/student/StudentDetails';
import Unauthorized from '../pages/Unauthorized';
import { ProtectedRoute, AdminRoute, TeacherRoute } from './AuthRoutes';
import Loading from '../pages/Loading';
import { useEffect, useState } from 'react';
import Profile from '../pages/Profile';
import Income from '../pages/accounts/Income';
import Expense from '../pages/accounts/Expense';
import BalanceSheet from '../pages/accounts/BalanceSheet';
import TeacherAttendence from '../pages/teacher/TeacherAttendence';
import FeesManagement from '../pages/Fees/Fees';


const AppRoutes = () => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    setRole(storedRole);
    setToken(storedToken);

    // Delay rendering to wait for localStorage update
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  if (loading) return <Loading text="SCHOOL MANAGEMENT SYSTEM" />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin or Principal Routes */}
        {token && (role === 'Admin' || role === 'Principle') && (
          <>
            <Route path='/admin-dashboard' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path='/addaccount' element={<AdminRoute><AddAccount /></AdminRoute>} />
            <Route path='/teacher/details' element={<AdminRoute><TeacherDetails /></AdminRoute>} />
            <Route path='/teacher/attendenace' element={<AdminRoute><TeacherAttendence /></AdminRoute>} />
            <Route path='/students/attendence' element={<AdminRoute><StudentAttendence /></AdminRoute>} />
            <Route path='/students/details' element={<AdminRoute><StudentDetails /></AdminRoute>} />
            <Route path='/accounts/income' element={<AdminRoute><Income /></AdminRoute>} />
            <Route path='/accounts/expenses' element={<AdminRoute><Expense /></AdminRoute>} />
            <Route path='/accounts/balancesheet' element={<AdminRoute><BalanceSheet /></AdminRoute>} />
            <Route path='/fees/register' element={<AdminRoute> <FeesManagement /> </AdminRoute>} />

          </>
        )}

       

        {/* Teacher Only Routes */}
        {token && role === 'Teacher' && (
          <>
            <Route path='/teacher-dashboard' element={<TeacherRoute><TeacherDashoard /></TeacherRoute>} />
            <Route path='/students/attendence' element={<TeacherRoute><StudentAttendence /></TeacherRoute>} />
            <Route path='/students/details' element={<TeacherRoute><StudentDetails /></TeacherRoute>} />
          </>
        )}

         {/* Admin or Principal Teacher Routes */}
        {token && (role === 'Admin' || role === 'Principle' || role === 'Teacher') && (
          <>
            <Route path='/profile' element={<Profile />} />
          </>
        )}

        {/* Invalid Role */}
        {token && !['Admin', 'Principle', 'Teacher'].includes(role) && (
          <Route path="*" element={<Unauthorized />} />
        )}

        {/* Universal unauthorized fallback for logged-in users */}
        {token && (
          <Route path="*" element={<Unauthorized />} />
        )}

        {/* No Token */}
        {!token && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
