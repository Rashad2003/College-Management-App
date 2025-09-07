import { FaUserGraduate } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SwitchPage = () => {

  return (
    <div className="w-full min-h-screen flex justify-center items-center gap-[1rem] md:gap-[5rem] flex-col md:flex-row bg-sky-50">
        <NavLink to="/faculty/login">
        <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-2xl text-black bg-white shadow-2xl">
            <div className="flex justify-center items-center flex-col h-full gap-[1rem]">
            <FaUser className="text-[5rem] text-sky-500" />
            <h2 className="text-3xl font-bold text-sky-800">Faculty</h2>
            </div>           
        </div>
        </NavLink>
        <NavLink to="/student/login">
        <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-2xl text-black bg-white shadow-2xl">
        <div className="flex justify-center items-center flex-col h-full gap-[1rem]">
            <FaUserGraduate className="text-[5rem] text-sky-500"/>
            <h1 className="text-3xl font-bold text-sky-800">Student</h1>
            </div> 
        </div>
        </NavLink>
    </div>
  );
};

export default SwitchPage;
