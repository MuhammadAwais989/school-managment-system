import React from 'react'
import { useEffect, useState } from "react";
import axios from 'axios'
import {BaseURL} from '../../helper/helper'
import  totalTeacehrs  from '../../../assets/images/totalTeachers.png'
import  presentTeacher  from '../../../assets/images/presentTeacher.png'
import  absentTeacher  from '../../../assets/images/AbsentTeacher.png'
import  leaveTeacher  from '../../../assets/images/leaveTeacher.png'
import loading from '../Loading'

const TeacherCard = () => {

     const [teacherList, setteacherList] = useState(0);
     const [loading, Setloading] = useState(true);

  useEffect(() => {
        const fetchTeacherCount = async () => {
            try {
                const response = await axios.get(`${BaseURL}/addaccount`);
                const users = response.data;
                
                const count = users.filter(user => user.designation === 'Teacher').length;
                setteacherList(count);
            } catch (err) {
                console.error("Failed to fetch user list:", err);
                
            }
          }
          fetchTeacherCount()
      }, []);

                console.log(teacherList);

  

      const TeachersData = [
    {
          type: "Total Teachers",
          count: teacherList,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-100",
          img: totalTeacehrs,
        },
        {
          type: "Present Teachers",
          count: 2102,
          iconColor: "text-green-600",
          bgColor: "bg-green-100",
          img: presentTeacher,
        },
        {
          type: "Absent Teachers",
          count: 42,
          iconColor: "text-red-600",
          bgColor: "bg-red-100",
          img: absentTeacher,
        },
        {
          type: "Leave Teachers",
          count: 30,
          iconColor: "text-yellow-600",
          bgColor: "bg-yellow-100",
          img: leaveTeacher,
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