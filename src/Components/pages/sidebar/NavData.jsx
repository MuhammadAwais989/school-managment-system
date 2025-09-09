import { RxDashboard } from "react-icons/rx";
import { MdAccountBalance } from "react-icons/md";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudentFill } from "react-icons/pi";
import { MdGroupAdd } from "react-icons/md";

const role = localStorage.getItem("role");

export const navItem = [
  {
    id: 1,
    label: "Dashboard",
    path: role === "Teacher" ? "/teacher-dashboard" : "/admin-dashboard",
    icon: <RxDashboard />,
  },
  {
    id: 2,
    label: "Student",
    path: "",
    icon: <PiStudentFill />,
    children: [
      { id: 2.1, label: "Students Attendence", path: "/students/attendence" },
      { id: 2.2, label: "Students Details", path: "/students/details" },
    ],
  },
  {
    id: 3,
    label: "Teacher",
    path: "",
    icon: <LiaChalkboardTeacherSolid />,
    children: [
      { id: 3.1, label: "Teacher Details", path: "/teacher/details" },
      { id: 3.2, label: "Teacher Attendance", path: "/teacher/attendenace" },
    ],
  },
  {
    id: 4,
    label: "Accounts",
    path: "",
    icon: <MdAccountBalance />,
    children: [
      { id: 4.1, label: "Income", path: "/accounts/income" },
      { id: 4.2, label: "Expenses", path: "/accounts/expenses" },
      { id: 4.3, label: "Balance Sheet", path: "/accounts/balancesheet" },
    ],
  },
  {
    id: 5,
    label: "Add Account",
    path: "/addaccount",
    icon: <MdGroupAdd />,
  },
];
