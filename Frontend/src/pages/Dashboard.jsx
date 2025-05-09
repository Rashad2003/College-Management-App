import { useEffect, useState, useContext } from "react";
import { SiGoogleclassroom } from "react-icons/si";
import {
  FaUserGraduate,
  FaUsers
} from "react-icons/fa";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { NavLink } from "react-router-dom";


export const Dashboard = () => {
  const { backendUrl } = useContext(StoreContext);
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
    <div className="flex gap-4 justify-around items-center my-8 flex-wrap">
    <NavLink to="/studentList">
      <div className="h-[150px] w-[150px] bg-orange-400 rounded-2xl shadow-2xl">
      <div className="h-full flex gap-[1rem] justify-around items-center flex-col">
        <SiGoogleclassroom className="text-[3rem] text-white mx-auto"/>
        <p className="font-bold text-white text-center">Department: {stats.classCount || 0}</p>
        </div>
      </div>
      </NavLink>
      <NavLink to="/studentList">
      <div className="h-[150px] w-[150px] bg-blue-400 rounded-2xl shadow-2xl">
          <div className="h-full flex gap-[1rem] justify-around items-center flex-col">
        <FaUserGraduate className="text-[3rem] text-white mx-auto"/>
          <p className="font-bold text-white text-center">Student: {stats.studentCount || 0}</p>
          </div>
      </div>
      </NavLink>
    </div>
    <NavLink to="/teacherList">
    <div className="flex gap-4 justify-center items-center">
      <div className="h-[150px] w-[150px] bg-green-400 rounded-2xl shadow-2xl">
      <div className="h-full flex gap-[1rem] justify-around items-center flex-col">
      <FaUsers className="text-[3rem] text-white mx-auto"/>
      <p className="font-bold text-white text-center">Teacher: {stats.userCount || 0}</p>
      </div>
      </div>
    </div>
    </NavLink>
    </>
  )
}
