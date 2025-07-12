import totalStudent from '../../../assets/images/toal-student-icon.png'
import present from '../../../assets/images/present-student-icon.png'
import absent from '../../../assets/images/absent-student-icon.png'
import AdminStudentChart from '../admin/AdminStudentChart';


const StudentCard = () => {
  const StudentsData = [
    {
      type: "Today Income",
      count: 2153,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      img: totalStudent,
    },
    {
      type: "Today Expense",
      count: 2102,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      img: present,
    },
    {
      type: "Today Balance",
      count: 42,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      img: absent,
    },
    {
      type: "Current Month Balance",
      count: 32356,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
      img: absent,
    },

  ]
  return (
    <>
      {StudentsData.map((items) => (
        <div id="card" key={items.type} className="lg:w-[23%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24  bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-between px-5 mt-8">
          <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
            <img src={items.img} alt="" className={`size-10 ${items.iconColor}`} />
          </div>

          <div className="text-center">
            <h3 className="font-sans font-semibold text-gray-600">{items.type}</h3>
            <h1 className="font-bold font-sans text-xl">{items.count}</h1>
          </div>
        </div>
      ))}
      <AdminStudentChart />
    </>
  )
}

export default StudentCard