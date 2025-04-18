import { NavLink } from "react-router-dom";
import {
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navLinkClass =
    "flex items-center gap-3 p-3 rounded hover:border-l-4 border-white text-white";

  return (
    <nav className="flex-1 lg:p-4 bg-purple-700 min-h-screen h-full">
      <ul className="space-y-4">
      {user?.role === "Admin" && (
        <>
        <li>
          <NavLink to="/dashboard" className={navLinkClass}>
            <FaClipboardList /> <p className="hidden md:block">Dashboard</p>
          </NavLink>
        </li>
        </>
      )}
        <li>
          <NavLink to="/attendance" className={navLinkClass}>
            <FaBook /> <p className="hidden md:block">Attendance</p>
          </NavLink>
        </li>
        {user?.role === "Admin" && (
          <>
            <li>
              <NavLink to="/students" className={navLinkClass}>
                <FaUserGraduate /> <p className="hidden md:block">Student</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={navLinkClass}>
                <FaCog /> <p className="hidden md:block">Register</p>
              </NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to="/report" className={navLinkClass}>
            <FaClipboardList /> <p className="hidden md:block">Report</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
