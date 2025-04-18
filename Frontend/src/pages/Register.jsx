import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { StoreContext } from "../context/storeContext";

export const Register = () => {
  const { backendUrl } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState("Add User");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    password: "",
    gender: "Male",
    role: "Admin",
  });
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const initialState = {
    name: "",
    phone: "",
    dob: "",
    email: "",
    address: "",
    password: "",
    gender: "Male",
    role: "Admin",
  };

  const updateUser = async () => {
    try {
      await axios.put(
        backendUrl + `/api/user/update/${selectedUserId}`,
        formData
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
      await axios.delete(backendUrl + `/api/user/delete/${selectedUserId}`);
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
    const res = await axios.get(backendUrl + "/api/user/list");
    console.log("Response:", res.data);
    setUserList(res.data.user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/user/register", formData);
      if (res.data.success) {
        toast.success("User added successfully!");
        setFormData({
          name: "",
          phone: "",
          dob: "",
          email: "",
          address: "",
          password: "",
          gender: "Male",
          role: "Admin",
        });
      } else {
        toast.error(res.data.message);
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
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return ( 
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex md:justify-center flex-wrap gap-4 mb-8">
          <button
            onClick={() => setCurrentPage("Add User")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Add User"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Add User
          </button>
          <button
            onClick={() => setCurrentPage("Search User")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Search User"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Search User
          </button>
          <button
            onClick={() => setCurrentPage("Update and Delete User")}
            className={`md:px-6 text-sm md:text-lg px-4 py-2 rounded-lg ${
              currentPage === "Update and Delete User"
                ? "bg-purple-700 text-white"
                : "bg-white text-black border"
            }`}
          >
            Update and Delete User
          </button>
        </div>

        <div className="font-bold text-gray-700">
          {currentPage === "Add User" && (
            <div className="border p-2 text-sm md:text-lg md:p-5 md:mx-[2rem] my-[1rem]">
              <p className="font-bold text-purple-700 text-sm md:text-lg">Add User:</p>
              <div className="flex flex-col md:flex-row md:gap-5 justify-around">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-bold">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                    className="outline-none border-b mb-6"
                  />

                  <label htmlFor="phone" className="font-bold">
                    Phone No:
                  </label>
                  <input
                    type="number"
                    id="phone"
                    onChange={handleChange}
                    value={formData.phone}
                    placeholder="+00 000 0000000"
                    className="outline-none border-b mb-6"
                  />

                  <label htmlFor="dob" className="font-bold">
                    DOB:
                  </label>
                  <input
                    type="date"
                    id="dob"
                    onChange={handleChange}
                    value={formData.dob}
                    placeholder="YYYY-MM-DD"
                    className="outline-none border-b mb-6"
                  />

                  <label htmlFor="email" className="font-bold">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="johndoe@domian.com"
                    className="outline-none border-b mb-6"
                  />

                  <label htmlFor="address" className="font-bold">
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    onChange={handleChange}
                    value={formData.address}
                    className="outline-none border-b"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="font-bold">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="********"
                    className="outline-none border-b mb-6"
                  />
                  <label htmlFor="gender" className="font-bold">
                    Gender:
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mb-6 border"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label htmlFor="roles" className="font-bold">
                    Role:
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mb-6 border"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Faculty">Faculty</option>
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
          {currentPage === "Search User" && (
            <div className="border p-5 lg:mx-[3rem] my-[1rem] w-[75vw] overflow-x-scroll">
              <p className="font-bold text-purple-700">Search User:</p>
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
              <div className="overflow-x-auto mt-6"></div>
              <table className="min-w-[800px] w-full border-collapse border text-sm md:text-lg text-center">
                <thead>
                  <tr className="border">
                    <th className="border">Name</th>
                    <th className="border">Email</th>
                    <th className="border">Phone</th>
                    <th className="border">Address</th>
                    <th className="border">Gender</th>
                    <th className="border">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={index} className="border text-center">
                      <td className="border">{highlightMatch(user.name)}</td>
                      <td className="border">{highlightMatch(user.email)}</td>
                      <td className="border">{user.phone}</td>
                      <td className="border">{user.address}</td>
                      <td className="border">{user.gender}</td>
                      <td className="border">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-start lg:justify-end">
                <p>Total Users: {userList.length}</p>
              </div>
            </div>
          )}
          {currentPage === "Update and Delete User" && (
            <div className="border p-2 md:p-5 lg:mx-[3rem] my-[1rem] w-[75vw] overflow-x-scroll">
              <p className="font-bold text-purple-700 text-sm md:text-lg">
                Update or Delete User:
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
  <table className="w-full border text-center text-sm md:text-lg min-w-[800px] mt-4">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">Select</th>
        <th className="border p-2">Name</th>
        <th className="border p-2">Email</th>
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
                const selected = userList.find((u) => u._id === user._id);
                if (selectedUserId === user._id) {
                  setSelectedUserId(null);
                  setFormData(initialState);
                } else {
                  setSelectedUserId(user._id);
                  setFormData({
                    name: selected.name,
                    phone: selected.phone,
                    dob: selected.dob?.slice(0, 10),
                    email: selected.email,
                    address: selected.address,
                    password: "", 
                    gender: selected.gender,
                    role: selected.role,
                  });
                }
              }}
            />
          </td>
          <td className="border p-2">{highlightMatch(user.name)}</td>
          <td className="border p-2">{highlightMatch(user.email)}</td>
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
                      <label className="font-bold">Phone No:</label>
                      <input
                        type="number"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
                      <label className="font-bold">DOB:</label>
                      <input
                        type="date"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
                      <label className="font-bold">Email:</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
                      <label className="font-bold">Address:</label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-bold">Password:</label>
                      <input
                        type="text"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="outline-none border-b mb-4"
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
                      <label className="font-bold">Role:</label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border mb-4"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Faculty">Faculty</option>
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
