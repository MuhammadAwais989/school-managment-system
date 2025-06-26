// src/components/ConfirmDeletePopup.jsx
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDeletePopup = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Are you sure you want to delete this user?
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
