import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import TeacherDashoard from '../pages/teacher/TeacherDashboard'
import AddAccount from '../pages/addAccount/AddAccount'
import TeacherDetails from '../pages/teacher/TeacherDetails'
import Login from '../pages/Login'

import {ProtectedRoute, AdminRoute, TeacherRoute} from './AuthRoutes'

const AppRoutes = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/admin-dashboard' element={<AdminRoute> <AdminDashboard /> </AdminRoute>}/>
        <Route path='/teacher-dashboard' element={<TeacherDashoard />}/>
        <Route path='/teacher/details' element={<TeacherDetails />}/>
        <Route path='/addaccount' element={<AddAccount />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default AppRoutes