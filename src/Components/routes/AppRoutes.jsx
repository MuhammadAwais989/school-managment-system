import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import SideBar from '../pages/sidebar/SideBar'
import { use, useState } from 'react'

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