// Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import Sidebar from "./sidebar/SideBar";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <>
    <Sidebar />
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md text-center animate-fade-in flex flex-col items-center justify-center">
        <div className="text-rose-600 text-6xl mb-4">
          <FaLock />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-6">You do not have access to view this page.</p>
        <button
          onClick={handleBackToLogin}
          className="bg-rose-600 text-white px-6 py-2 rounded-full hover:bg-rose-700 transition "
        >
          Back to Login
        </button>
         
              <button
                onClick={() => navigate(-1)}
                className="text-rose-600 hover:text-rose-700 transition-all font-medium py-2"
              >
                Go back to previous page
              </button>
      </div>
    </div>
    </>
    
  );
};

export default Unauthorized;
