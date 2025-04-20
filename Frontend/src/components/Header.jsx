import { PiStudent } from "react-icons/pi";
import DateTime from './DateTime'
import { MdLogout } from "react-icons/md";
import {useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
    <nav>
        <div className='grid grid-cols-[1fr] md:grid-cols-[1fr_5fr]'>
            <div className='bg-purple-700 w-full px-[16.5px]'>
            <PiStudent className="text-[5rem] text-white mx-auto my-2"/>
                <p className='font-bold text-white text-center'>Attendance Management System</p>
            </div>
            <div>
                <div>
                <DateTime/>
                </div>
                <div className="flex justify-between bg-purple-700 p-4 text-sm md:p-6 md:text-lg">
                    <div className="flex gap-4">
                    <div className="text-white">
                        <p>Welcome:</p>
                        <p>Role:</p>
                    </div>
                    <div className="text-white">
                        <p>{user?.name || "Guest"}</p>
                        <p>{user?.role || "Unknown"}</p>
                    </div>
                </div>
                <div>
                <MdLogout className="border bg-white rounded-full text-purple-700 p-1 w-[35px] h-[35px] md:p-2 md:w-[50px] md:h-[50px]" onClick={logout}/>
                </div>
                </div>
            </div>
        </div>
    </nav>
    </>
  )
}

export default Header