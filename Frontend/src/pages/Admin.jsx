import { Link } from "react-router-dom";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaFilePdf,
  FaBookOpen,
  FaUserCheck,
  FaUserGraduate,
  FaBook,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

const Admin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Dashboard card data
    const cards = [
      {
        title: "Dashboard",
        icon: <FaClipboardList className="w-8 h-8 text-blue-600" />,
        link: "/dashboard",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-100",
      },
      {
        title: "Announcement",
        icon: <FaBullhorn className="w-8 h-8 text-gray-600" />,
        link: "/faculty/announcement",
        bgColor: "bg-gray-50",
        hoverColor: "hover:bg-gray-100",
      },
      {
        title: "Students",
        icon: <FaUserGraduate className="w-8 h-8 text-pink-600" />,
        link: "/students",
        bgColor: "bg-pink-50",
        hoverColor: "hover:bg-pink-100",
      },
      {
        title: "Course",
        icon: <FaUserGraduate className="w-8 h-8 text-orange-600" />,
        link: "/course",
        bgColor: "bg-orange-50",
        hoverColor: "hover:bg-orange-100",
      },
      {
        title: "Register",
        icon: <FaCog className="w-8 h-8 text-sky-600" />,
        link: "/register",
        bgColor: "bg-sky-50",
        hoverColor: "hover:bg-sky-100",
      },
      {
        title: "Attendance",
        icon: <FaUserCheck className="w-8 h-8 text-purple-600" />,
        link: "/attendance",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-100",
      },
      {
        title: "Timetable",
        icon: <FaCalendarAlt className="w-8 h-8 text-green-600" />,
        link: "/faculty/timetable",
        bgColor: "bg-green-50",
        hoverColor: "hover:bg-green-100",
      },
      {
        title: "Results",
        icon: <FaFilePdf className="w-8 h-8 text-yellow-600" />,
        link: "/faculty/result",
        bgColor: "bg-yellow-50",
        hoverColor: "hover:bg-yellow-100",
      },
      {
        title: "Study Materials",
        icon: <FaBookOpen className="w-8 h-8 text-red-600" />,
        link: "/faculty/studymaterials",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-100",
      },
      {
        title: "Report",
        icon: <FaClipboardList className="w-8 h-8 text-cyan-600" />,
        link: "/report",
        bgColor: "bg-cyan-50",
        hoverColor: "hover:bg-cyan-100",
      },
      
    ];
  return (
    <>
    <div className="min-h-screen p-6">
        {/* Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.hoverColor} p-6 rounded-2xl cursor-pointer transition-all duration-300`}
            >
              <Link to={card.link} className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-full shadow-sm border">{card.icon}</div>
                <h2 className="text-[13px] font-semibold text-gray-800 text-center">{card.title}</h2>
              </Link>
            </div>
          ))}
        </div>
    </div>
    </>
  )
}

export default Admin