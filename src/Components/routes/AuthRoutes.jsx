import React from "react";
import { Navigate } from "react-router-dom";

// Generic Protected Route (checks if token exists)
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

// Admin or Principal only Route
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return token && (role === "Admin" || role === "Principle")
    ? children
    : <Navigate to="/" />;
};

// Teacher only Route
export const TeacherRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return token && role === "Teacher"
    ? children
    : <Navigate to="/" />;
};
