import React from 'react'

const PopupModel = ({isModalOpen, onclose}) => {


  const InputData = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "fathr name", type: "text", placeholder: "Father Name" },
    { name: "gender", type: "text", placeholder: "Gender" },
    { name: "date of joining", type: "date", placeholder: "Date of Joining" },
    { name: "class", type: "text", placeholder: "Class" },
    { name: "section", type: "text", placeholder: "Section" },
    { name: "date of birth", type: "date", placeholder: "Date of Birth" },
    { name: "address", type: "text", placeholder: "Address" },
    { name: "phone", type: "tel", placeholder: "Phone Number" },
    { name: "email", type: "email", placeholder: "Email" },
    ]
  return (
    <>
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 lg:w-[50%] ">
            <h2 className="text-xl font-semibold mb-4">Add Account</h2>
            
            {/* Form or content here */}
            <div className='flex flex-wrap w-full'>
            {InputData.map((field, index) =>(

              <input
              key={index}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              required
              className="w-full lg:w-72 mx-2 border focus:border-rose-300 outline-none rounded px-3 py-2 mb-4"
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