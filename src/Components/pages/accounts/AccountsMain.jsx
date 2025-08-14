import totalStudent from '../../../assets/images/toal-student-icon.png';
import present from '../../../assets/images/present-student-icon.png';
import absent from '../../../assets/images/absent-student-icon.png';
import AdminStudentChart from '../admin/AdminStudentChart';

const AccountsMain = () => {
  const AccountsCardData = [
  {
    type: "Today Income",
    count: 2153,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    img: totalStudent,
    cardColor: "from-blue-100/80 via-blue-50 to-white",
    borderColor: "border-blue-200",
    textColor: "text-blue-800"
  },
  {
    type: "Today Expense",
    count: 2102,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-100",
    img: present,
    cardColor: "from-teal-100/80 via-teal-50 to-white",
    borderColor: "border-teal-200",
    textColor: "text-teal-800"
  },
  {
    type: "Today Balance",
    count: 42,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100",
    img: absent,
    cardColor: "from-indigo-100/80 via-indigo-50 to-white",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-800"
  },
  {
    type: "Current Month Balance",
    count: 32356,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-100",
    img: absent,
    cardColor: "from-cyan-100/80 via-cyan-50 to-white",
    borderColor: "border-cyan-200",
    textColor: "text-cyan-800"
  },
];

  return (
    <>
    
      <div className="flex flex-wrap gap-4 w-full">
        {AccountsCardData.map((items) => (
          <div
            key={items.type}
            className={`lg:w-[23.8%] w-60 max-sm:w-[47%] sm:w-[47%] max-[460px]:w-full h-24 bg-gradient-to-br ${items.cardColor} border ${items.borderColor} rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center justify-between px-5`}
          >
            <div className={`size-16 rounded-full ${items.bgColor} flex justify-center items-center`}>
              <img src={items.img} alt="" className={`size-10 ${items.iconColor}`} />
            </div>
            <div className="text-center">
              <h3 className={`font-sans font-semibold ${items.textColor}`}>{items.type}</h3>
              <h1 className={`font-bold font-sans text-xl ${items.textColor}`}>{items.count}</h1>
            </div>
          </div>
        ))}
      </div>
      <AdminStudentChart />
    </>
  );
};

export default AccountsMain;