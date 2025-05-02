import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";

export const TeacherList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [userList, setUserList] = useState([]);
    const { backendUrl } = useContext(StoreContext);

    const fetchUsers = async () => {
        const res = await axios.get(backendUrl + "/api/user/list");
        console.log("Response:", res.data);
        setUserList(res.data.user);
      };
    
      useEffect(() => {
        fetchUsers();
      }, []);

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
            <div className="border p-5 lg:mx-[3rem] my-[1rem] w-[75vw] overflow-x-scroll">
              <p className="font-bold text-purple-700">Teachers List:</p>
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
    </>
  )
}
