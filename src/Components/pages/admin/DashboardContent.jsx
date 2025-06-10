import React from 'react'
import { PiStudentDuotone } from "react-icons/pi";


const DashboardContent = () => {
    const StudentsData = [
    {
      type: "Total Student",
      count: 2153,
    },
    {
      type: "Present Student",
      count: 2102,
    },
    {
      type: "Absent Student",
      count: 42,
    },
    {
      type: "Leave Student",
      count: 30,
    },
  ]
  return (
     <div className="bg-gray-50 h-fit w-full pl-4 pt-8 pr-4 max-lg:pl-24 max-sm:pt-0 max-sm:pl-3 sm:pt-16 flex flex-wrap gap-x-4">
          {StudentsData.map((items) =>(
        <div id="card" key={items.type} className="w-60 h-24 bg-white rounded-md shadow-md flex items-center justify-between px-5 mt-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100	flex justify-center items-center text-3xl text-green-600">
            <PiStudentDuotone />
          </div>

          <div className="text-center">
            <h3 className="font-sans font-semibold text-gray-600">{items.type}</h3>
            <h1 className="font-bold font-sans text-xl">{items.count}</h1>
          </div> 
        </div>
          ))}
      </div>
  )
}

export default DashboardContent