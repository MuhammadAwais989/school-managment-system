import React from 'react';

const ViewPopup = ({ data, onClose, title = "Details", imageKey = "profilePic", fields = [] }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-rose-600 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-rose-600">{title}</h2>

        {/* Profile Image */}
        {data[imageKey] && (
          <div className="flex justify-center mb-6">
            <img
              src={data[imageKey]}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-2 border-rose-400"
            />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          {fields.map((field, index) => (
            <div
              key={index}
              className={field.fullWidth ? "sm:col-span-2" : ""}
            >
              <span className="font-medium">{field.label}:</span> {data[field.key]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
