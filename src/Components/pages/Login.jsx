import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import bg from "../../assets/images/loginBG.jpg";
import axios from "axios";
import { BaseURL } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${BaseURL}/login`, { email, password });
    const { token, role, Class, section } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // ✅ Store class and section (only if teacher)
    if (role === "Teacher") {
      localStorage.setItem("classAssigned", Class);
      localStorage.setItem("sectionAssigned", section);
}


    toast.success("Login successful");

    // ✅ Force reload to trigger correct route rendering
    if (role === "Admin" || role === "Principle") {
      window.location.href = "/admin-dashboard";
    } else if (role === "Teacher") {
      window.location.href = "/teacher-dashboard";
    } else {
      toast.error("Unauthorized role");
    }

  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative pt-16 backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        {/* Avatar */}
        <div className="flex justify-center mb-4 absolute -top-10 left-1/2 -translate-x-1/2">
          <RxAvatar className="w-20 h-20 rounded-full shadow bg-[#00264D] p-4 text-white text-lg" />
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>
        <p className="text-center text-white mt-2 text-lg font-medium">
          Welcome Back
        </p>
        <p className="text-center text-white mb-6 text-sm">
          Enter your email and password to Sign In
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              placeholder="Email"
              className="pl-10 pr-3 py-3 w-full rounded bg-white/60 placeholder-gray-600 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10 py-3 w-full rounded bg-white/60 placeholder-gray-600 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
