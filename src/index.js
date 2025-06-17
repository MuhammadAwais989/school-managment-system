import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Components/routes/AppRoutes';
import '../src/App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <AppRoutes />
    <ToastContainer />
    </>
);

