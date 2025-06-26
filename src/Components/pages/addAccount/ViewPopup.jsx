import React from 'react';

const ViewPopup = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-rose-600 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-rose-600">User Details</h2>

        {/* Profile Image */}
        {user.profilePic && (
          <div className="flex justify-center mb-6">
            <img
              src={user.profilePic}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-rose-400"
            />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <div><span className="font-medium">Name:</span> {user.name}</div>
          <div><span className="font-medium">Father Name:</span> {user.fatherName}</div>
          <div><span className="font-medium">Email:</span> {user.email}</div>
          <div><span className="font-medium">Phone:</span> {user.phone}</div>
          <div><span className="font-medium">Designation:</span> {user.designation}</div>
          <div><span className="font-medium">Class:</span> {user.Class}</div>
          <div><span className="font-medium">Section:</span> {user.section}</div>
          <div><span className="font-medium">Salary:</span> {user.salary}</div>
          <div><span className="font-medium">Gender:</span> {user.gender}</div>
          <div><span className="font-medium">Date of Birth:</span> {user.dateOfBirth}</div>
          <div><span className="font-medium">Joining Date:</span> {user.dateOfJoining}</div>
          <div className="sm:col-span-2"><span className="font-medium">Address:</span> {user.address}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
