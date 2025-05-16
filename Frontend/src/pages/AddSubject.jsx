import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import axios from 'axios';

function AddSubject() {
  const { backendUrl } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState("Add Subject");
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: '', code: '', department: '', year: '', semester: ''
  });
  const [department, setDepartment] = useState("");
  const [subjectsBySemester, setSubjectsBySemester] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(backendUrl + '/api/subject/add', form, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        toast.success("Subject added successfully!");
        setForm({
          name: '', code: '', department: '', year: '', semester: ''
        });
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const fetchSubjects = async () => {
    try {
      if (!department.trim()) {
        toast.warning("Please enter a department.");
        return;
      }
  
      const res = await axios.get(backendUrl + '/api/subject/list');
  console.log(res.data)
      if (res.data.success) {
        const subjects = res.data;

        // Group by semester
        const grouped = {};
        for (let i = 1; i <= 8; i++) {
          grouped[i] = subjects.filter((s) => s.semester.trim() === i.toString());
        }
        console.log("Grouped Subjects:", grouped);
        setSubjectsBySemester(grouped);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex md:justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={() => setCurrentPage("Add Subject")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Add Subject"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Add Subject
          </button>
          <button
            onClick={() => setCurrentPage("List Subject")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "List Subject"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            List Subject
          </button>
          <button
            onClick={() => setCurrentPage("Update and Delete Subject")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Update and Delete Subject"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Update and Delete Subject
          </button>
        </div>

        <div className="font-bold text-gray-700">
          {currentPage === "Add Subject" && (
            <div className="border p-2 text-sm md:text-lg md:p-5 md:mx-[2rem] my-[1rem]">
              <p className="font-bold text-purple-700 text-sm md:text-lg">Add Subject:</p>
              <div className="flex flex-col md:flex-row md:gap-5 justify-around">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-bold">
                    Name:
                  </label>
                  <input
                    onChange={handleChange}
                    value={form.name}
                    type="text"
                    id="name"
                    className="outline-none border-b mb-6"
                  />
<label htmlFor="code" className="font-bold">
                     Code:
                   </label>
                   <input
                    onChange={handleChange}
                    value={form.code}
                    type="text"
                    id="code"
                    className="outline-none border-b mb-6"
                  />
                  <label htmlFor="department" className="font-bold">
                    Select Department:
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={form.department}
                    onChange={handleChange}
                    className="outline-none mb-6 border"
                  >
                    <option value="">--Select--</option>
                    <option value="IT">IT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                <label className="font-bold">Year:</label>
<select
  id="year"
  value={form.year}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Year--</option>
  <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
</select>
                <label className="font-bold">Semester:</label>
 <select
  id="semester"
  value={form.semester}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Semester--</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
</select>
                </div>
              </div>
              <div className="mx-auto w-[100px]">
                <button
                  className="bg-purple-900 text-white py-2 px-10"
                  onClick={handleSubmit}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          {currentPage === "List Subject" && (
             <div className="p-6 max-w-4xl mx-auto">
             <h1 className="text-2xl font-bold mb-4 text-center">Subject List</h1>
       
             <div className="mb-6 flex gap-4 items-center">
               <select
                    name="department"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">--Select Department--</option>
                    <option value="IT">IT</option>
                    <option value="Other">Other</option>
                  </select>
               <button
                 onClick={fetchSubjects}
                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
               >
                 Search
               </button>
             </div>
       
             {Object.entries(subjectsBySemester).map(([sem, subjects]) => (
               subjects.length > 0 && (
                 <div key={sem} className="mb-10">
                   <h2 className="text-lg font-semibold text-blue-600 mb-2">Semester {sem}</h2>
                   <table className="w-full border border-collapse">
                     <thead className="bg-gray-200">
                       <tr>
                         <th className="border p-2">S.No</th>
                         <th className="border p-2">Subject Code</th>
                         <th className="border p-2">Subject Name</th>
                       </tr>
                     </thead>
                     <tbody>
                       {subjects.map((subj, idx) => (
                         <tr key={idx}>
                           <td className="border p-2">{idx + 1}</td>
                           <td className="border p-2">{subj.code}</td>
                           <td className="border p-2">{subj.name}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )
             ))}
           </div>
          )}
          {currentPage === "Update and Delete Student" && (
            <div className="border p-2 md:p-5 md:mx-[3rem] my-[1rem]">
              <p className="font-bold text-purple-700 text-sm md:text-lg">
                Update or Delete Students:
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
              </div>

              {searchTerm && !selectedUserId && (
                <table className="w-full border text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Select</th>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Register</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="border p-2">
                          <input
                            type="checkbox"
                            checked={selectedUserId === user._id}
                            onChange={() => {
                              const selected = userList.find(
                                (u) => u._id === user._id
                              );
                              if (selectedUserId === user._id) {
                                setSelectedUserId(null);
                                setFormData(initialState);
                              } else {
                                setSelectedUserId(user._id);
                                setFormData({
                                  name: selected.name,
                                  department: selected.department,
                                  year: selected.year,
                                  section: selected.section,
                                  register: selected.register,
                                  dob: selected.dob?.slice(0, 10),
                                  email: selected.email,
                                  phone: selected.phone,
                                  gender: selected.gender,
                                });
                              }
                            }}
                          />
                        </td>
                        <td className="border p-2">
                          {highlightMatch(user.name)}
                        </td>
                        <td className="border p-2">
                          {highlightMatch(user.register)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedUserId && (
                <>
                  <div className="flex md:gap-5 justify-around flex-col md:flex-row mt-6">
                    <div className="flex flex-col">
                      <label className="font-bold">Name:</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
                      <label htmlFor="code" className="font-bold">
                    Code:
                  </label>
                   <input
                    onChange={handleChange}
                    value={form.code}
                    type="text"
                    id="name"
                    className="outline-none border-b mb-6"
                  />
                        <label htmlFor="Class" className="font-bold">
                    Select Department:
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="outline-none mb-6 border"
                  >
                    <option value="">--Select--</option>
                    <option value="IT">IT</option>
                    <option value="Other">Other</option>
                  </select>
                  <label className="font-bold">Year:</label>
<select
  id="year"
  value={formData.year}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Year--</option>
  <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
</select>
<label className="font-bold">Section:</label>
<select
  id="section"
  value={formData.section}
  onChange={handleChange}
  className="outline-none mb-4 border"
>
  <option value="">--Select Section--</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
</select>
                    </div>
                    <div className="flex flex-col">
                    
                      <label htmlFor="reg" className="font-bold">
                        Reg No:
                      </label>
                      <input
                        value={formData.register}
                        onChange={handleChange}
                        type="text"
                        id="reg"
                        className="outline-none border-b mb-6"
                      />
                      <label htmlFor="email" className="font-bold">
                    Email:
                  </label>
                  <input
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    id="email"
                    className="outline-none border-b mb-6"
                  />              
                      <label className="font-bold">Gender:</label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="border mb-4"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6 gap-6">
                    <button
                      className="bg-blue-700 text-white px-6 py-2 rounded"
                      onClick={updateUser}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded"
                      onClick={deleteUser}
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
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
//       <h2 className="text-lg font-bold mb-2">Add Subject</h2>
//       <label htmlFor="name" className="font-bold">
//                     Name:
//                   </label>
//                   <input
//                     onChange={handleChange}
//                     value={form.name}
//                     type="text"
//                     id="name"
//                     className="outline-none border-b mb-6"
//                   />
//                    <label htmlFor="name" className="font-bold">
//                     Code:
//                   </label>
//                   <input
//                     onChange={handleChange}
//                     value={form.code}
//                     type="text"
//                     id="name"
//                     className="outline-none border-b mb-6"
//                   />
//                   <label htmlFor="Class" className="font-bold">
//                     Select Department:
//                   </label>
//                   <select
//                     name="department"
//                     id="department"
//                     value={form.department}
//                     onChange={handleChange}
//                     className="outline-none mb-6 border"
//                   >
//                     <option value="">--Select--</option>
//                     <option value="IT">IT</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   <label className="font-bold">Year:</label>
// <select
//   id="year"
//   value={form.year}
//   onChange={handleChange}
//   className="outline-none mb-4 border"
// >
//   <option value="">--Select Year--</option>
//   <option value="1st">1st</option>
//   <option value="2nd">2nd</option>
//   <option value="3rd">3rd</option>
//   <option value="4th">4th</option>
// </select>
// <label className="font-bold">Section:</label>
// <select
//   id="section"
//   value={form.section}
//   onChange={handleChange}
//   className="outline-none mb-4 border"
// >
//   <option value="">--Select Section--</option>
//   <option value="A">A</option>
//   <option value="B">B</option>
//   <option value="C">C</option>
// </select>
// <label className="font-bold">Semester:</label>
// <select
//   id="semester"
//   value={form.semester}
//   onChange={handleChange}
//   className="outline-none mb-4 border"
// >
//   <option value="">--Select Semester--</option>
//   <option value="1">1</option>
//   <option value="2">2</option>
//   <option value="3">3</option>
//   <option value="4">4</option>
//   <option value="5">5</option>
//   <option value="6">6</option>
//   <option value="7">7</option>
//   <option value="8">8</option>
// </select>
//       <input name="semester" value={form.semester} onChange={handleChange} placeholder="Semester" type="number" required className="w-full mb-2 p-2 border rounded" />
//       <select
//   name="type"
//   value={form.type}
//   onChange={handleChange}
//   required
//   className="w-full mb-2 p-2 border rounded"
// >
//   <option value="">Select Type</option>
//   <option value="Theory">Theory</option>
//   <option value="Practical">Practical</option>
// </select>

//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Subject</button>
//     </form>
  );
}

export default AddSubject;
