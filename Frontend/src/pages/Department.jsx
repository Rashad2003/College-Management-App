import { NavLink } from "react-router-dom";
import {
    FaUserGraduate,
    FaUsers
  } from "react-icons/fa";

export const Department = () => {
  return (
    <div className="w-full h-full flex justify-center">
    <div className="btectIT">
        <h1 className="text-center font-bold text-4xl text-purple-700">BTECH - IT</h1>
        <div className="flex gap-4 justify-around items-center my-8 flex-wrap">
            <NavLink to="/teacherList">
            <div className="flex gap-4 justify-center items-center">
      <div className="h-[150px] w-[150px] bg-green-400 rounded-2xl shadow-2xl">
      <div className="h-full flex gap-[1rem] justify-center items-center flex-col">
      <FaUsers className="text-[3rem] text-white mx-auto"/>
      <p className="font-bold text-white text-center">Teacher</p>
      </div>
      </div>
    </div>
            </NavLink>
            <NavLink to="/studentList">
            <div className="h-[150px] w-[150px] bg-blue-400 rounded-2xl shadow-2xl">
          <div className="h-full flex gap-[1rem] justify-center items-center flex-col">
        <FaUserGraduate className="text-[3rem] text-white mx-auto"/>
          <p className="font-bold text-white text-center">Student</p>
          </div>
      </div>
            </NavLink>
        </div>
    </div>
    </div>
  )
}
