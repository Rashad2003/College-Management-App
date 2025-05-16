import React from 'react'

export const FacultyDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
    <div className="flex justify-center items-center md:w-[400px] md:h-[200px] rounded-2xl shadow-2xl shadow-purple-700 bg-purple-700 p-2 text-sm md:p-4 md:text-lg mx-auto my-[5rem] font-semibold">
                    <div className="flex gap-4">
                    <div className="text-white">
                        <p>Name:</p>
                        <p>Role:</p>
                        <p>Faculty Code:</p>
                        <p>Designation:</p>
                        
                    </div>
                    <div className="text-white">
                        <p>{user?.name || "Guest"}</p>
                        <p>{user?.role || "Unknown"}</p>
                        <p>{user?.facultyCode || "Unknown"}</p>
                        <p>{user?.designation || "Unknown"}</p>
                    </div>
                </div>
                </div>

    </>
  )
}
