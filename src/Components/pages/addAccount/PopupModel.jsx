import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputData } from './PopupModelData';
import { BaseURL } from '../../helper/helper';
import { showError, showSuccess } from '../../utils/Toast.js';
import Loading from '../Loading.jsx';

const PopupModel = ({ isModalOpen, onclose, editMode = false, existingData = null }) => {
  const [formValues, setFormValues] = useState({});
  const [displayValues, setDisplayValues] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (editMode && existingData) {
      // Format existing data for display
      const formattedDisplay = {...existingData};
      if (existingData.phone) {
        formattedDisplay.phone = formatPhoneForDisplay(existingData.phone);
      }
      if (existingData.CNIC_No) {
        formattedDisplay.CNIC_No = formatCNICForDisplay(existingData.CNIC_No);
      }
      
      // Format dates for input type="date" (YYYY-MM-DD)
      if (existingData.dateOfBirth) {
        formattedDisplay.dateOfBirth = formatDateForInput(existingData.dateOfBirth);
      }
      if (existingData.dateOfJoining) {
        formattedDisplay.dateOfJoining = formatDateForInput(existingData.dateOfJoining);
      }
      
      setFormValues(existingData);
      setDisplayValues(formattedDisplay);
      setPreviewImage(existingData.profilePic || null);
    } else {
      setFormValues({});
      setDisplayValues({});
      setPreviewImage(null);
    }
  }, [editMode, existingData]);

  // Format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse the date and format it
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Format phone number for display (XXXX-XXXXXXX)
  const formatPhoneForDisplay = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 11)}`;
  };

  // Format CNIC for display (XXXXX-XXXXXXX-X)
  const formatCNICForDisplay = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    if (numbers.length <= 12) return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 12)}-${numbers.slice(12, 13)}`;
  };

  // Remove formatting for backend (remove hyphens)
  const removeFormatting = (value) => {
    return value ? value.replace(/\D/g, '') : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedDisplayValue = value;
    let rawValue = value;

    // Apply formatting for display
    if (name === 'phone') {
      formattedDisplayValue = formatPhoneForDisplay(value);
      rawValue = removeFormatting(value);
    } else if (name === 'CNIC_No') {
      formattedDisplayValue = formatCNICForDisplay(value);
      rawValue = removeFormatting(value);
    } else if (name === 'dateOfBirth' || name === 'dateOfJoining') {
      // For date inputs, the value is already in YYYY-MM-DD format
      // which is what we want to send to the backend
      formattedDisplayValue = value;
      rawValue = value;
    }

    // Update both display and form values
    setDisplayValues(prev => ({ ...prev, [name]: formattedDisplayValue }));
    setFormValues(prev => ({ ...prev, [name]: rawValue }));
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
    setloading(true);
    const formData = new FormData();

    // Send raw values (without hyphens) to backend
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (selectedFile) {
      formData.append('profilePic', selectedFile);
    }

    try {
      if (editMode) {
        const response = await axios.put(`${BaseURL}/addaccount/${existingData._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('User updated successfully');
      } else {
        const response = await axios.post(`${BaseURL}/addaccount`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('User added successfully');
      }

      setFormValues({});
      setDisplayValues({});
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error('Submit Error:', error);
      showError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setloading(false);
      onclose();
    }
  };

  if (loading) return <Loading text={editMode ? "Updating Data..." : "Adding User.."} />;

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? "Edit Account" : "Add New Account"}
              </h2>
              <button
                onClick={onclose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {InputData.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.placeholder}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>

                    {field.type === 'select' || field.name === 'Class' || field.name === 'section' || field.name === 'gender' ? (
                      <div className="relative">
                        <select
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                        >
                          <option value="" disabled>
                            Select {field.placeholder}
                          </option>
                          {field.name === 'Class' ? (
                            <>
                              <option value="Nursery">Nursery</option>
                              <option value="KG-I">KG-I</option>
                              <option value="KG-II">KG-II</option>
                              <option value="One">One</option>
                              <option value="Two">Two</option>
                              <option value="Three">Three</option>
                              <option value="Four">Four</option>
                              <option value="Five">Five</option>
                              <option value="Six">Six</option>
                              <option value="Seven">Seven</option>
                              <option value="Eight">Eight</option>
                              <option value="Nine">Nine</option>
                              <option value="Matric">Matric</option>
                            </>
                          ) : field.name === 'section' ? (
                            <>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </>
                          ) : field.name === 'gender' ? (
                            <>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </>
                          ) : (
                            field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    ) : field.name === 'phone' ? (
                      <input
                        type="tel"
                        name={field.name}
                        placeholder="0300-1234567"
                        value={displayValues[field.name] || ''}
                        onChange={handleChange}
                        maxLength={12}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    ) : field.name === 'CNIC_No' ? (
                      <input
                        type="text"
                        name={field.name}
                        placeholder="12345-1234567-1"
                        value={displayValues[field.name] || ''}
                        onChange={handleChange}
                        maxLength={15}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    ) : field.name === 'dateOfBirth' || field.name === 'dateOfJoining' ? (
                      <input
                        type="date"
                        name={field.name}
                        value={displayValues[field.name] || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        maxLength={field.length}
                        value={formValues[field.name] || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    )}
                  </div>
                ))}

                {/* Image upload section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        id="profilePic"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {previewImage && (
                      <div className="flex-shrink-0">
                        <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={onclose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  {editMode ? "Update Account" : "Add Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModel;