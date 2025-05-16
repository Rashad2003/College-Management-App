import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";

export const AddStudent = () => {
  const { backendUrl } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
    section: "",
    dob: "",
    register: "",
    email:"",
    password:"",
    phone:"",
    gender: "Male",
  });
  const [currentPage, setCurrentPage] = useState("Add Student");
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const initialState = {
    name: "",
    department: "",
    year: "",
    section: "",
    dob: "",
    register: "",
    email:"",
    password:"",
    phone:"",
    gender: "Male",
  };

  const updateUser = async () => {
    try {
      await axios.put(
        backendUrl + `/api/student/update/${selectedUserId}`,
        formData, { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User updated!");
      fetchUsers();
      setSelectedUserId(null);
      setFormData(initialState);
    } catch (error) {
      console.log(error);

      toast.error("Update failed");
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(backendUrl + `/api/student/delete/${selectedUserId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("User deleted!");
      fetchUsers();
      setSelectedUserId(null);
      setFormData(initialState);
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get(backendUrl + "/api/student/list", { headers: { Authorization: `Bearer ${token}` } });
    console.log("Response:", res.data);
    setUserList(res.data.students);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/student/add", formData, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        toast.success("User added successfully!");
        setFormData({
          name: "",
          department: "",
          year: "",
          section: "",
          dob: "",
          register: "",
          email:"",
          password:"",
          phone:"",
          gender: "Male",
        });
      } else {
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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

  const filteredUsers = userList.filter(
    (students) =>
      students.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      students.register.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex md:justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={() => setCurrentPage("Add Student")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Add Student"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Add Student
          </button>
          <button
            onClick={() => setCurrentPage("Search Student")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Search Student"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Search Student
          </button>
          <button
            onClick={() => setCurrentPage("Update and Delete Student")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Update and Delete Student"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Update and Delete Student
          </button>
        </div>

        <div className="font-bold text-gray-700">
          {currentPage === "Add Student" && (
            <div className="border p-2 text-sm md:text-lg md:p-5 md:mx-[2rem] my-[1rem]">
              <p className="font-bold text-purple-700 text-sm md:text-lg">Add Student:</p>
              <div className="flex flex-col md:flex-row md:gap-5 justify-around">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-bold">
                    Name:
                  </label>
                  <input
                    onChange={handleChange}
                    value={formData.name}
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
                   <label htmlFor="phone" className="font-bold">
                    Phone No.
                  </label>
                  <input
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    id="phone"
                    className="outline-none border-b mb-6"
                  />
                </div>
                <div className="flex flex-col">
                <label className="font-bold">DOB:</label>
                      <input
                        type="date"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="outline-none border-b mb-6"
                      />
                  <label htmlFor="register" className="font-bold">
                    Reg No:
                  </label>
                  <input
                    value={formData.register}
                    onChange={handleChange}
                    type="text"
                    id="register"
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
                  <label htmlFor="gender" className="font-bold">
                    Gender:
                  </label>
                  <select
                    className="border mb-6"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
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
          {currentPage === "Search Student" && (
            <div className="border p-2 md:p-5 md:mx-[3rem] my-[1rem]">
            <p className="font-bold text-purple-700 text-sm md:text-lg">
              Search Students:
            </p>

            <div className="flex gap-5 justify-start md:items-center flex-col md:flex-row my-4">
              <label className="font-bold text-sm md:text-lg">Search:</label>
              <input
                type="text"
                placeholder="Search by name or register no."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none border-b px-2 text-sm md:text-lg"
              />
              <IoSearchOutline className="text-[1.5rem] font-bold" />
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
                      disabled
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
                  disabled
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
disabled
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
disabled
>
<option value="">--Select Section--</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
</select>
                     <label htmlFor="phone" className="font-bold">
                  Phone No.
                </label>
                <input
                  value={formData.phone}
                  onChange={handleChange}
                  type="text"
                  id="phone"
                  className="outline-none border-b mb-6"
                  disabled
                />
                  </div>
                  <div className="flex flex-col">
                  <label className="font-bold">DOB:</label>
                    <input
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="outline-none border-b mb-4"
                      disabled
                    />
                    <label htmlFor="reg" className="font-bold">
                      Register No:
                    </label>
                    <input
                      value={formData.register}
                      onChange={handleChange}
                      type="text"
                      id="reg"
                      className="outline-none border-b mb-6"
                      disabled
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
                  disabled
                />              
                    <label className="font-bold">Gender:</label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border mb-4"
                      disabled
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}
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
                <IoSearchOutline className="text-[1.5rem] font-bold" />
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
                        disabled
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
                       <label htmlFor="phone" className="font-bold">
                    Phone No.
                  </label>
                  <input
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    id="phone"
                    className="outline-none border-b mb-6"
                  />
                    </div>
                    <div className="flex flex-col">
                    <label className="font-bold">DOB:</label>
                      <input
                        type="date"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
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
  );
};
