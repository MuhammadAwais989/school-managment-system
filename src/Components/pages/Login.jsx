import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import bg from "../../assets/images/steptodown.com229552.jpg";
import axios from "axios";
import { BaseURL } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useActivities } from "../../Context/Activities.Context";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { addActivity } = useActivities(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BaseURL}/login`, { email, password });
      console.log("✅ Login Response:", res.data); // Debugging
      
      const { token, role, Class, section, name, user } = res.data;

      // ✅ Store user info in localStorage for activities
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("classAssigned", Class);
      localStorage.setItem("classSection", section);
      localStorage.setItem("userEmail", email);
      
      // ✅ Store user name if available
      if (name) {
        localStorage.setItem("userName", name);
      } else if (user?.name) {
        localStorage.setItem("userName", user.name);
      } else {
        localStorage.setItem("userName", email.split('@')[0]);
      }

      if (role === "Teacher") {
        localStorage.setItem("classAssigned", Class);
        localStorage.setItem("teacherClass", Class); 
      }

      // ✅ FIXED: Login Activity with proper user data
      const userName = name || user?.name || email.split('@')[0];
      
      addActivity({
        type: "login",
        title: "User Login",
        description: `${userName} successfully logged in as ${role}`,
        user: userName
      });

      console.log("✅ Login activity added for:", userName);

      toast.success("Login successful");

      // ✅ FIXED: Use navigate instead of window.location.href
      if (role === "Admin" || role === "Principle") {
        navigate("/admin-dashboard");
      } else if (role === "Teacher") {
        navigate("/teacher-dashboard");
      } else {
        toast.error("Unauthorized role");
      }

    } catch (err) {
      console.error("❌ Login Error:", err);
      
      // ✅ Failed login activity
      addActivity({
        type: "login", 
        title: "Failed Login Attempt",
        description: `Failed login attempt for ${email}`,
        user: "Unknown"
      });
      
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center "
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative pt-16 backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-lg w-full max-w-sm max-[500px]:w-[95%] ">
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