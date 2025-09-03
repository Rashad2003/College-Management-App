import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const FacultyAnnouncement = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem('token');
    const {backendUrl} = useContext(StoreContext)
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [department, setDepartment] = useState("All");
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState([]);
  
    useEffect(() => {
      fetchAnnouncements();
      fetchCourse();
    }, []);
  
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get( backendUrl + "/api/announcements/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    const fetchCourse = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/course/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);        
        setCourse(res.data.courses)
      } catch (error) {
        console.error("Error fetching :", error);
        console.error("Error fetching course:", error);
      }
    }
  
    const handlePostAnnouncement = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        await axios.post(
          backendUrl + "/api/announcements/add",
          { title, message, department },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTitle("");
        setMessage(""); 
        setDepartment("All");
        fetchAnnouncements();
      } catch (error) {
        console.error("Error posting announcement:", error);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaBullhorn className="text-gray-600" /> Announcements
          </h1>
        </div>

        {/* Post Announcement Form (Faculty Only) */}
        {user.role === "Faculty" || "Admin" && (
          <form
            onSubmit={handlePostAnnouncement}
            className="bg-white p-6 rounded-2xl shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Post New Announcement</h2>
            <input
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <select
              className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-none"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {course.map((subj, index) => (
    <option key={index} value={subj.courseName}>
      {subj.courseName}
    </option>
  ))}
            </select>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Announcement"}
            </button>
          </form>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-center text-gray-600">No announcements yet.</p>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann._id}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-bold text-sky-800">{ann.title}</h3>
                <p className="text-gray-600 mt-2">{ann.message}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <FaCalendarAlt />
                  <span>{new Date(ann.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FacultyAnnouncement