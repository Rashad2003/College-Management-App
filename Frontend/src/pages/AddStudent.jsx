import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { StoreContext } from "../context/storeContext";
import axios from "axios";

export const AddStudent = () => {
  const { backendUrl } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    register: "",
    email:"",
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
    class: "",
    register: "",
    email:"",
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
          class: "Class A",
          register: "",
          email:"",
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
      students.class.toLowerCase().includes(searchTerm.toLowerCase())
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
                    Select Class:
                  </label>
                  <select
                    name="class"
                    id="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="mb-6 border"
                  >
                    <option>--Select--</option>
                    <option value="class A">Class A</option>
                    <option value="class B">Class B</option>
                    <option value="class C">Class C</option>
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
            <div className="border p-5 lg:mx-[3rem] my-[1rem] w-[75vw] overflow-x-scroll">
              <p className="font-bold text-purple-700 text-sm md:text-lg">Search Students:</p>
              <div className="flex gap-5 justify-around">
                <div className="flex flex-col">
                  <label htmlFor="search" className="font-bold">
                    Search:
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search by Name or Email"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="outline-none border-b mb-6"
                    />
                    <IoSearchOutline className="text-[1.5rem] font-bold" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto mt-6">
              <table className="min-w-[800px] w-full border-collapse border text-sm md:text-lg text-center">
                <thead>
                  <tr className="border">
                    <th className="border">Name</th>
                    <th className="border">Class</th>
                    <th className="border">Register No.</th>
                    <th className="border">Email</th>
                    <th className="border">Phone</th>
                    <th className="border">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index} className="border text-center">
                      <td className="border">{highlightMatch(user.name)}</td>
                      <td className="border">{highlightMatch(user.class)}</td>
                      <td className="border">{user.register}</td>
                      <td className="border">{user.email}</td>
                      <td className="border">{user.phone}</td>
                      <td className="border">{user.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <div className="flex justify-start md:justify-end">
                <p>Total Students: {userList.length}</p>
              </div>
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
                      <th className="border p-2">Class</th>
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
                                  class: selected.class,
                                  register: selected.register,
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
                          {highlightMatch(user.class)}
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
                      <label htmlFor="Class" className="font-bold">
                        Select Class:
                      </label>
                      <select
                        name="class"
                        id="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="mb-6 border"
                      >
                        <option value="class A">Class A</option>
                        <option value="class B">Class B</option>
                        <option value="class C">Class C</option>
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
