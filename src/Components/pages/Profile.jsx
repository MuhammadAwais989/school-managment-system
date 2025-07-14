import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/SideBar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${BaseURL}/addaccount/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-24 pt-14 px-6 pb-4 bg-gray-50 w-full min-h-screen">
        <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto p-6">
          <div className="flex flex-col items-center gap-4">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-rose-500"
            />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.designation}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Name" value={user.name} />
            <Field label="Father Name" value={user.fatherName} />
            <Field label="Date of Joining" value={user.dateOfJoining} />
            <Field label="Class" value={user.Class} />
            <Field label="Section" value={user.section} />
            <Field label="Gender" value={user.gender} />
            <Field label="Designation" value={user.designation} />
            <Field label="Salary" value={user.salary} />
            <Field label="Date of Birth" value={user.dateOfBirth} />
            <Field label="Phone Number" value={user.phone} />
            <Field label="Email" value={user.email} />
            <Field label="CNIC/B-Form" value={user.CNIC_No} />
            <Field label="Role" value={user.role || "User"} />
            <Field label="Password" value="********" />
            <div className="sm:col-span-2">
              <Field label="Home Address" value={user.address} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Field = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-gray-900">{value || "N/A"}</p>
  </div>
);

export default Profile;
