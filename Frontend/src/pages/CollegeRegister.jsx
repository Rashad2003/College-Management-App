import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

const CollegeRegister = () => {
      const navigate = useNavigate();
  const { backendUrl } = useContext(StoreContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: "",
    collegeCode: "",
    email: "",
    password: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/college/add", formData);
      if(res.data.success) {
        toast.success("College Added Successfully");
        setFormData({
          collegeName: "",
    collegeCode: "",
    email: "",
    password: "",
        })
      } else{
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  return (
    <>
          <div className="flex items-center justify-center h-screen bg-gray-100 text-sm md:text-lg">
            <div className="p-8 bg-white md:w-[500px] md:h-[400px] rounded-2xl shadow-2xl">
              <h1 className="text-center font-bold text-base md:text-2xl mb-4 text-purple-900">College Management App</h1>
              <h1 className="text-center font-bold text-base md:text-2xl">Register College</h1>
              <form onSubmit={onSubmitHandler}>
                    <div className="flex flex-col mb-4">  
                  <label className="mb-2 font-bold" htmlFor="collegeName">College Name:</label>
                  <input
                    type="text"
                    id="collegeName"
                    className="border border-gray-500"
                    onChange={handleChange}
                    value={formData.collegeName}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                    
                  <label className="mb-2 font-bold" htmlFor="collegeCode">College Code:</label>
                  <input
                    type="text"
                    id="collegeCode"
                    className="border border-gray-500"
                    onChange={handleChange}
                    value={formData.collegeCode}
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">

                  <label className="mb-2 font-bold" htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    className="border border-gray-500"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-bold" htmlFor="password">Password:</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="border border-gray-500"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <span
              className="relative left-[13.5rem] bottom-[1.1rem] md:left-[25.5rem] md:bottom-[1.5rem] text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
                </div>
                <button type="submit" className="w-full mt-4 bg-purple-900 text-white py-2 mt-5">
                  Register
                </button>           
              </form>
            </div>
          </div>
        </>
  )
}

export default CollegeRegister