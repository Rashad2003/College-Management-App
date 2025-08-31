import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import { IoSearchOutline } from "react-icons/io5";

export const Course = () => {
  const [currentPage, setCurrentPage] = useState("Add Course");
  const [courseName, setCourseName] = useState("");
  const [subjects, setSubjects] = useState([{ name: "", code: "" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseList, setCourseList] = useState([]);

  const { backendUrl } = useContext(StoreContext);
  const token = localStorage.getItem('token');

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubjectField = () => {
    setSubjects([...subjects, { name: "", code: "" }]);
  };

  const resetForm = () => {
    setCourseName("");
    setSubjects([{ name: "", code: "" }]);
    setSelectedCourse(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/course/add",
        {courseName, subjects}, { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      fetchCourse();
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error adding course");
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/course/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseList(res.data.courses);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching courses");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const updateCourse = async () => {
    if (!selectedCourse) return toast.error("Select a course first");
    try {
      await axios.put(backendUrl + `/api/course/update/${selectedCourse._id}`,
      {courseName, subjects}, { headers: { Authorization: `Bearer ${token}` } }
      ); 
      toast.success("Course updated!");
      fetchCourse();
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  }

  const deleteCourse = async () => {
    if (!selectedCourse) return toast.error("Select a course first");
    try {
      await axios.delete(backendUrl + `/api/course/delete/${selectedCourse._id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Course deleted!");
      fetchCourse();
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-black">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredCourses = courseList.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-4">
    <div className="flex md:justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={() => setCurrentPage("Add Course")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Add Course"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Add Course
          </button>
          <button
            onClick={() => setCurrentPage("Search Course")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Search Course"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Search Course
          </button>
          <button
            onClick={() => setCurrentPage("Update and Delete Course")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Update and Delete Course"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Update and Delete Course
          </button>
        </div>

    <div className="font-bold text-gray-700">
    {currentPage === "Add Course" && (
      <div className="border p-2 text-sm md:text-lg md:p-5 md:mx-[2rem] my-[1rem]">
      <p className="font-bold text-purple-700 text-sm md:text-lg">Add Course</p>
      <div className="flex flex-col md:gap-5 justify-around">
      <div className="flex flex-col">
        <label htmlFor="Course Name" className="font-bold">Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="outline-none border-b mb-6"
          id="Course Name"
          required
        />
</div>
        {subjects.map((subject, index) => (
          <div key={index} className="flex justify-around">
            <div>
            <label htmlFor="Subject Name" className="font-bold">Subject Name:</label>
            <input
              type="text"
              value={subject.name}
              onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
              className="outline-none border-b mb-6"
          id="Subject Name"
              required
            />
            </div>
            <div>
            <label htmlFor="Subject Code" className="font-bold">Subject Code:</label>
            <input
              type="text"
              value={subject.code}
              onChange={(e) => handleSubjectChange(index, "code", e.target.value)}
              className="outline-none border-b mb-6"
          id="Subject Code"
              required
            />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
        <button type="button" onClick={addSubjectField}>
          + Add Another Subject
        </button>
        </div>
        </div>
        <div className="mx-auto w-fit">
        <button onClick={handleSubmit} className="bg-purple-900 text-white py-2 px-10">Save Course</button>
        </div>
      </div>
      )}
      {currentPage === "Search Course" && (
        <div className="border p-2 md:p-5 md:mx-[3rem] my-[1rem]">
          <p className="font-bold text-purple-700 text-sm md:text-lg">
              Search Course:
          </p>
            <div className="flex gap-5 justify-start md:items-center flex-col md:flex-row my-4">
              <label className="font-bold text-sm md:text-lg">Search:</label>
              <input
                type="text"
                placeholder="Search by Course Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none border-b px-2 text-sm md:text-lg"
              />
              <IoSearchOutline className="text-[1.5rem] font-bold" />
            </div>

            {searchTerm && !selectedCourse && (
              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Select</th>
                    <th className="border p-2">Course Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id}>
                      <td className="border p-2">
                        <input
                          type="checkbox"
                          checked={selectedCourse?._id === course._id}
                          onChange={() => {
                            setSelectedCourse(course);
                            setCourseName(course.courseName);
                            setSubjects(course.subjects)
                          }}
                        />
                      </td>
                      <td className="border p-2">
                        {highlightMatch(course.courseName)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

{selectedCourse && (
               <>
               <div className="flex flex-col md:gap-5 justify-around">
     <div className="flex flex-col">
       <label htmlFor="Course Name" className="font-bold">Course Name:</label>
       <input
         type="text"
         value={courseName}
         onChange={(e) => setCourseName(e.target.value)}
         className="outline-none border-b mb-6"
         id="Course Name"
         disabled
       />
</div>
       {subjects.map((sub, index) => (
         <div key={index} className="flex justify-around">
           <div>
           <label htmlFor="Subject Name" className="font-bold">Subject Name:</label>
           <input
             type="text"
             value={sub.name}
             onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
             className="outline-none border-b mb-6"
         id="Subject Name"
             disabled
           />
           </div>
           <div>
           <label htmlFor="Subject Code" className="font-bold">Subject Code:</label>
           <input
             type="text"
             value={sub.code}
             onChange={(e) => handleSubjectChange(index, "code", e.target.value)}
             className="outline-none border-b mb-6"
         id="Subject Code"
             disabled
           />
           </div>
         </div>
       ))}
       </div>
             </>
            )}
        </div>
      )}
      {currentPage === "Update and Delete Course" && (
        <div className="border p-2 md:p-5 md:mx-[3rem] my-[1rem]">
          <p className="font-bold text-purple-700 text-sm md:text-lg">
                Update or Delete Course:
              </p>

              <div className="flex gap-5 justify-start md:items-center flex-col md:flex-row my-4">
                <label className="font-bold text-sm md:text-lg">Search:</label>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none border-b px-2 text-sm md:text-lg"
                />
                <IoSearchOutline className="text-[1.5rem] font-bold" />
              </div>

              {searchTerm && !selectedCourse && (
              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Select</th>
                    <th className="border p-2">Course Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id}>
                      <td className="border p-2">
                        <input
                          type="checkbox"
                          checked={selectedCourse?._id === course._id}
                          onChange={() => {
                            setSelectedCourse(course);
                            setCourseName(course.courseName);
                            setSubjects(course.subjects)
                          }}
                        />
                      </td>
                      <td className="border p-2">
                        {highlightMatch(course.courseName)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

{selectedCourse && (
              <>
                <div className="flex flex-col md:gap-5 justify-around">
      <div className="flex flex-col">
        <label htmlFor="Course Name" className="font-bold">Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="outline-none border-b mb-6"
          id="Course Name"
          required
        />
</div>
        {subjects.map((subject, index) => (
          <div key={index} className="flex justify-around">
            <div>
            <label htmlFor="Subject Name" className="font-bold">Subject Name:</label>
            <input
              type="text"
              value={subject.name}
              onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
              className="outline-none border-b mb-6"
          id="Subject Name"
              required
            />
            </div>
            <div>
            <label htmlFor="Subject Code" className="font-bold">Subject Code:</label>
            <input
              type="text"
              value={subject.code}
              onChange={(e) => handleSubjectChange(index, "code", e.target.value)}
              className="outline-none border-b mb-6"
          id="Subject Code"
              required
            />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
        <button type="button" onClick={addSubjectField}>
          + Add Another Subject
        </button>
        </div>
        </div>
        <div className="flex justify-center mt-6 gap-6">
                    <button
                      className="bg-blue-700 text-white px-6 py-2 rounded"
                      onClick={updateCourse}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded"
                      onClick={deleteCourse}
                    >
                      Delete
                    </button>
                  </div>
              </>
            )}

          </div>
      )}
    </div>   
    </div>
    </>
  );
}
