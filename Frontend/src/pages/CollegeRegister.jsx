import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CollegeRegister = () => {
      const navigate = useNavigate();
  const [collegeData, setCollegeData] = useState({
    collegeName: "",
    collegeCode: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
      localStorage.setItem("collegeInfo", JSON.stringify(collegeData));
      navigate("/register-admin");
  };
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCollegeData((prev) => ({ ...prev, [id]: value }));
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
                    value={collegeData.collegeName}
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
                    value={collegeData.collegeCode}
                    required
                  />
                </div>
                <button type="submit" className="w-full mt-4 bg-purple-900 text-white py-2 mt-5">
                  Next
                </button>           
              </form>
            </div>
          </div>
        </>
  )
}

export default CollegeRegister