import React from 'react'
import  present  from '../../../assets/images/present-student-icon.png'
import  absent  from '../../../assets/images/absent-student-icon.webp'


const TeacherCard = () => {
      const TeachersData = [
    {
          type: "Total Teachers",
          count: 2153,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          type: "Present Teachers",
          count: 2102,
          iconColor: "text-green-600",
          bgColor: "bg-green-100",
          img: present,
        },
        {
          type: "Absent Teachers",
          count: 42,
          iconColor: "text-red-600",
          bgColor: "bg-red-100",
          img: absent,
        },
        {
          type: "Leave Teachers",
          count: 30,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-100"
        },
      ]
  return (
    <>
          {TeachersData.map((items) =>(
              <div id="card" key={items.type} className="lg:w-[23%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24  bg-white rounded-md shadow-md flex items-center justify-between px-5 mt-8">
          <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
              {/* <PiStudentDuotone className={`text-2xl ${items.iconColor}`} /> */}
              <img src={items.img} alt="" className={`size-10 ${items.iconColor}`}/>
            </div>

          <div className="text-center">
            <h3 className="font-sans font-semibold text-gray-600">{items.type}</h3>
            <h1 className="font-bold font-sans text-xl">{items.count}</h1> 
          </div> 
        </div>
          ))}
    </>
  )
}

export default TeacherCard