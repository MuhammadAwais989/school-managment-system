import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputData from './StudentPopModelData.jsx';
import { BaseURL } from '../../helper/helper';
import { showError, showSuccess } from '../../utils/Toast.js';
import Loading from '../Loading.jsx';

const StudentAdPopup = ({ isModalOpen, onclose, editMode = false, existingData = null }) => {
  const [formValues, setFormValues] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && existingData) {
      setFormValues(existingData);
      setPreviewImage(existingData.studentPic || null);
    } else {
      setFormValues({});
      setPreviewImage(null);
    }
  }, [editMode, existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file && file.size > MAX_FILE_SIZE) {
      showError('Image size exceeds 5MB. Please choose a smaller image.');
      setSelectedFile(null);
      setPreviewImage(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (selectedFile) {
      formData.append('studentPic', selectedFile);
    }

    try {
      if (editMode) {
        await axios.put(`${BaseURL}/students/details${existingData._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Student updated successfully');
      } else {
        await axios.post(`${BaseURL}/students/details`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Student added successfully');
      }

      setFormValues({});
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Submit Error:', error);
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      onclose();
    }
  };

  if (loading) return <Loading text={editMode ? 'Updating Student...' : 'Adding Student...'} />;

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 md:w-[65%] max-md:h-[85%] md:h-[90%]  overflow-y-auto scrollbar-hide">
          <div
            onClick={onclose}
            className="absolute right-0 top-0 cursor-pointer flex justify-center items-center bg-rose-100 size-8 rounded-full mr-3 mt-3"
          >
            <button className="text-rose-800 hover:text-red-500 text-2xl -mt-1 font-bold focus:outline-none">&times;</button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Edit Student' : 'Add Student'}
          </h2>

          <div className="flex flex-wrap w-full">
            {InputData.map((field, index) => (
              <div key={index} className="w-full md:w-full lg:w-[47%] mx-2 mb-4">
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleChange}
                    required
                    className="w-full border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-2"
                  >
                    <option value="" disabled>{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    maxLength={field.length}
                    value={formValues[field.name] || ''}
                    onChange={handleChange}
                    required
                    className="w-full border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-2"
                  />
                )}
              </div>
            ))}

            <div className="w-full md:w-full lg:w-[47%] mx-2 mb-4 relative">
              <div className="flex">
                <label htmlFor="studentPic" className="block text-gray-500 text-sm absolute right-14 top-3 max-sm:hidden">
                  Select Picture
                </label>
                <input
                  type="file"
                  id="studentPic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-1"
                />
                {previewImage && (
                  <div className="mt-2 ml-3">
                    <img src={previewImage} alt="Preview" className="h-8 w-8 object-cover rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <button onClick={onclose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-8 py-2 bg-rose-600 text-white rounded hover:bg-rose-700">
              {editMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default StudentAdPopup;
