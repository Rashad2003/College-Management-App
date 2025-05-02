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
      <div className="border h-[100px] w-[200px] bg-orange-400">
        <SiGoogleclassroom className="text-[3rem] text-white mx-auto my-2"/>
        <p className="font-bold text-white text-center">Department: {stats.classCount || 0}</p>
      </div>
      <NavLink to="/studentList">
        <div className="border h-[100px] w-[200px] bg-blue-400">
        <FaUserGraduate className="text-[3rem] text-white mx-auto my-2"/>
          <p className="font-bold text-white text-center">Student: {stats.studentCount || 0}</p>
      </div>
      </NavLink>
    </div>
    <NavLink to="/teacherList">
    <div className="flex gap-4 justify-center items-center">
      <div className="border h-[100px] w-[200px] bg-green-400">
      <FaUsers className="text-[3rem] text-white mx-auto my-2"/>
      <p className="font-bold text-white text-center">Teacher: {stats.userCount || 0}</p>
      </div>
    </div>
    </NavLink>
    </>
  )
}
