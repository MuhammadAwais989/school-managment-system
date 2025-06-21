import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './Components/routes/AppRoutes';
import '../src/App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

console.log("API URL:", process.env.REACT_APP_API_URL);
console.log("Cloud Name:", process.env.REACT_APP_CLOUD_NAME);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <AppRoutes />
    <ToastContainer />
    </>
);

