import React, { useState } from 'react'
import axios from 'axios'
import {InputData} from './PopupModelData'
import {BaseURL} from '../../helper/helper'
import { showError, showSuccess } from '../../utils/Toast.js'



const PopupModel = ({isModalOpen, onclose}) => {

  const [FormData, setFormData] = useState({})

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setFormData(pre => ({...pre, [name]: value}))
  };

  const handleSubmit = async () =>{
    try {
        const response = await axios.post(`${BaseURL}/addaccount`, FormData)
        console.log('Data sent successfully:', response);
        setFormData({})
        showSuccess("User Added Successfully")
        onclose()
    } catch (error) {
      console.log(`Post API Error ${error}`);
      showError("Please Fill All Field")
    }
  }
 
  return (
     <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 md:w-[65%] max-md:h-[85%] md:h-[90%] lg:h-fit overflow-auto scrollbar-hide">
            <div onClick={onclose} className='absolute right-0 top-0 cursor-pointer flex justify-center items-center bg-rose-100 size-8  rounded-full mr-3 mt-3'>
              <button
                  className="text-rose-800 hover:text-red-500 text-2xl  -mt-1 font-bold focus:outline-none "
              >
                  &times;
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4 ">Add Account</h2>

            <div className="flex flex-wrap w-full">
              {InputData.map((field, index) => (
                <div key={index} className="w-full md:w-full lg:w-[47%] mx-2 mb-4 "> 
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={FormData[field.name] || ''} // Set value from formData
                      onChange={handleChange}
                      required
                      className="w-full border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-2"
                    >
                      <option value="" disabled>
                        {field.placeholder} {/* Display placeholder as the first option */}
                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      maxLength={field.length}
                      value={FormData[field.name] || ''} // Ensure input values are controlled
                      required
                      onChange={handleChange}
                      className="w-full border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <button
                onClick={onclose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PopupModel