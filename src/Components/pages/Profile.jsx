import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../helper/helper";
import Sidebar from "./sidebar/SideBar";

const Profile = () => {
  const [user, setUser] = useState(null);

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
    return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-[90px] pt-14 pr-2 pb-2 max-sm:pt-1 max-sm:pl-2 max-lg:pl-[90px] bg-gray-50 w-full h-full">
        <div className="bg-white w-full h-full shadow-md rounded-md  px-4 max-sm:px-4 pb-2">
          <div className="flex flex-col items-center gap-4 mb-10">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-rose-500 shadow-md"
            />
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-lg text-gray-500">{user.designation}</p>
          </div>

          {/* Section 1: Basic Info */}
          <Section title="Basic Information">
            <Field label="Name" value={user.name} />
            <Field label="Father Name" value={user.fatherName} />
            <Field label="Date of Birth" value={user.dateOfBirth} />
            <Field label="Gender" value={user.gender} />
          </Section>

          {/* Section 2: Contact Info */}
          <Section title="Contact Information">
            <Field label="Phone Number" value={user.phone} />
            <Field label="Email" value={user.email} />
            <div className="sm:col-span-2">
              <Field label="Home Address" value={user.address} />
            </div>
          </Section>

          {/* Section 3: Other Info */}
          <Section title="Other Information">
            <Field label="Designation" value={user.designation} />
            <Field label="Class" value={user.Class} />
            <Field label="Section" value={user.section} />
            <Field label="Salary" value={user.salary} />
            <Field label="CNIC/B-Form" value={user.CNIC_No} />
            <Field label="Role" value={user.role || "User"} />
            <Field label="Date of Joining" value={user.dateOfJoining} />
          </Section>
        </div>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-rose-600 mb-4 border-b border-rose-200 pb-1">
      {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <div className="bg-gray-100 px-3 py-2 rounded text-gray-800 shadow-sm border border-gray-200 mt-1">
      {value || "N/A"}
    </div>
  </div>
);

export default Profile;
