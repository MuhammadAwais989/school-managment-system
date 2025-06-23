import {BrowserRouter, Routes, Route} from 'react-router-dom'
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
    {/* <SideBar /> */}
    <Routes>
        <Route exact path='/' element={<AdminDashboard />}/>
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