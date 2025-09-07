import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";

const AdminRegister = () => {
    const navigate = useNavigate();
  const { backendUrl } = useContext(StoreContext);
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("collegeInfo");
    if (stored) {
      setCollegeInfo(JSON.parse(stored));
    } else {
      navigate("/register-college"); // fallback if direct access
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdminData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...collegeInfo,
        ...adminData,
      };

      const res = await axios.post(`${backendUrl}/api/college/add`, payload);

      if (res.data.success) {
        localStorage.removeItem("collegeInfo");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("college", JSON.stringify(res.data.college));
        toast.success("College registered successfully!");
        navigate("admin"); // redirect to your page-3
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (!collegeInfo) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg w-[400px]"
    >
      <h2 className="text-xl font-bold mb-4">Register Admin for {collegeInfo.collegeName}</h2>
      <label className="block mb-2">Admin Name:</label>
      <input
        type="text"
        id="name"
        value={adminData.name}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
        required
      />
      <label className="block mb-2">Admin Email:</label>
      <input
        type="email"
        id="email"
        value={adminData.email}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
        required
      />
      <label className="block mb-2">Admin Password:</label>
      <input
        type="password"
        id="password"
        value={adminData.password}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
        required
      />
      <button
        type="submit"
        className="w-full bg-purple-900 text-white p-2 rounded"
      >
        Register Admin
      </button>
    </form>
  </div>
  );
};

export default AdminRegister;