import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Components/routes/AppRoutes';
import '../src/App.css'
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <AppRoutes />
    <ToastContainer />
    </>
);

