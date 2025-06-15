import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AddAccount from '../pages/addAccount/AddAccount'
import TeacherDetails from '../pages/teacher/TeacherDetails'
// import Lgin from '../pages/Login'

const AppRoutes = () => {
  return (
    <>
    <BrowserRouter>
    {/* <SideBar /> */}
    <Routes>
        <Route path='/' element={<AdminDashboard />}/>
        <Route path='/addaccount' element={<AddAccount />}/>
        <Route path='/teacher/details' element={<TeacherDetails />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default AppRoutes