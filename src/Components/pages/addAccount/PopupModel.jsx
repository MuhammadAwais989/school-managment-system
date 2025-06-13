import React from 'react'

const PopupModel = ({isModalOpen, onclose}) => {
  return (
    <>
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Account</h2>
            
            {/* Form or content here */}
            <input
              type="text"
              placeholder="Enter account name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            
            <div className="flex justify-end">
              <button
                onClick={onclose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
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