import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import TeacherDashoard from '../pages/teacher/TeacherDashboard'
import AddAccount from '../pages/addAccount/AddAccount'
import TeacherDetails from '../pages/teacher/TeacherDetails'
import Login from '../pages/Login'

import { ProtectedRoute, AdminRoute, TeacherRoute } from './AuthRoutes'
import Sidebar from '../pages/sidebar/SideBar'
import StudentAttendence from '../pages/student/StudentAttendence'
import StudentDetails from '../pages/student/StudentDetails'
import Unauthorized from '../pages/Unauthorized'

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />

          {/* Admin or Principal Routes */}
          {token && (role === 'Admin' || role === 'Principle') && (
            <>
              <Route path='/admin-dashboard' element={<AdminRoute> <AdminDashboard /> </AdminRoute>} />
              <Route path='/addaccount' element={<AdminRoute> <AddAccount /> </AdminRoute>} />
              <Route path='/teacher/details' element={<AdminRoute> <TeacherDetails /> </AdminRoute>} />
              <Route path='/students/attendence' element={<AdminRoute> <StudentAttendence /> </AdminRoute>} />
              <Route path='/students/details' element={<AdminRoute> <StudentDetails /> </AdminRoute>} />

            </>
          )}

          {/* Teacher Only Routes */}
          {token && role === 'Teacher' && (
            <>
              <Route path='/students/attendence' element={<TeacherRoute> <StudentAttendence /> </TeacherRoute>} />
              <Route path='/students/details' element={<TeacherRoute> <StudentDetails /> </TeacherRoute>} />
            </>
          )}

          {/* Catch-all route if not matched */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRoutes
