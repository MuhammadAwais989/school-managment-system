import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
// import Lgin from '../pages/Login'

const AppRoutes = () => {
  return (
    <>
    <BrowserRouter>
    {/* <SideBar /> */}
    <Routes>
        <Route path='/' element={<AdminDashboard />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default AppRoutes