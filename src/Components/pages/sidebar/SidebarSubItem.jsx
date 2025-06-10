import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const SidebarSubItem = ({ childrenItems, isOpen }) => {
  const location = useLocation();

  return (
    <div
      className={`ml-6 overflow-hidden transition-all duration-300 ease-in-out`}
      style={{ maxHeight: isOpen ? `${childrenItems.length * 40}px` : "0px" }}
    >
      {childrenItems.map((child) => (
        <Link to={child.path} key={child.id} className="block w-full">
          <li
            className={`w-full cursor-pointer flex items-center px-3 py-2 mb-1 text-[15px] rounded-lg ${
              location.pathname === child.path
                ? "bg-rose-400 text-white"
                : "text-gray-700 hover:bg-rose-100"
            }`}
          >
            <span className="ml-4">{child.label}</span>
          </li>
        </Link>
      ))}
    </div>
  );
};
export default SidebarSubItem;