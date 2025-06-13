import  totalStudent  from '../../../assets/images/toal-student-icon.png'
import  present  from '../../../assets/images/present-student-icon.png'
import  absent  from '../../../assets/images/absent-student-icon.png'
import  leave  from '../../../assets/images/leave.png'
import TeacherCard from '../teacher/TeacherCard';
import AccountsMain from '../accounts/AccountsMain'


const StudentCard = () => {
    const StudentsData = [
{
      type: "Total Students",
      count: 2153,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      img: totalStudent,
    },
    {
      type: "Present Students",
      count: 2102,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      img: present,
    },
    {
      type: "Absent Students",
      count: 42,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      img: absent,
    },
    {
      type: "Leave Students",
      count: 30,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
      img: leave,
    },
  ]
  return (
    <>
     <div className="bg-gray-50 h-fit w-full lg:pl-28 pl-4 pt-8 max-sm:pr-1 max-lg:pl-24 max-sm:pt-0 max-sm:pl-3 sm:pt-16 flex flex-wrap gap-x-4">
          {StudentsData.map((items) =>(
        <div id="card" key={items.type} className="lg:w-[23%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24  bg-white rounded-md shadow-md flex items-center justify-between px-5 mt-8">
          <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
              <img src={items.img} alt="" className={`size-10 ${items.iconColor}`}/>
            </div>

          <div className="text-center">
            <h3 className="font-sans font-semibold text-gray-600">{items.type}</h3>
            <h1 className="font-bold font-sans text-xl">{items.count}</h1> 
          </div> 
        </div>
          ))}
            <TeacherCard />
            <AccountsMain />
      </div>
    </>
  )
}

export default StudentCard