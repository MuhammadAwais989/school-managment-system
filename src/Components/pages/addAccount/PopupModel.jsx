import React, { useState } from 'react'
import axios from 'axios'
import {BaseURL} from '../../helper/helper'

const PopupModel = ({isModalOpen, onclose}) => {

  const [FormData, setFormData] = useState({})

  const handleChnage = (e) =>{
    const {name, value} = e.target;
    setFormData(pre => ({...pre, [name]: value}))
  };

  const handleSubmit = async () =>{
    try {
          const rssponse = await axios.post(`${BaseURL}/adaccount`, FormData)

    } catch (error) {
      console.log(`Post API Error ${error}`);
      
    }
  }
  const InputData = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "fathr name", type: "text", placeholder: "Father Name" },
    { name: "gender", type: "text", placeholder: "Gender" },
    { name: "date of joining", type: "date", placeholder: "Date of Joining" },
    { name: "class", type: "text", placeholder: "Class" },
    { name: "section", type: "text", placeholder: "Section" },
    { name: "address", type: "text", placeholder: "Home Address" },
    { name: "phone", type: "text", placeholder: "Phone Number", length: 11},
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
    ]
  return (
    <>
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-[65%] max-md:h-[85%] md:h-[90%] lg:h-fit  overflow-auto">
            <h2 className="text-xl font-semibold mb-4 ">Add Account</h2>
            
            {/* Form or content here */}
            <div className='flex flex-wrap w-full'>
            {InputData.map((field, index) =>(

              <input
              key={index}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              maxLength={field.length}
              required
              onChange={handleChnage}
              className="w-full md:w-full lg:w-[47%] mx-2 border focus:border-rose-300 focus:bg-rose-50 outline-none rounded px-3 py-2 mb-4"
              />
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