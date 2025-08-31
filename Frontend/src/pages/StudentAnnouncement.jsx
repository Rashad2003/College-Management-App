import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import { StoreContext } from '../context/StoreContext';

const StudentAnnouncement = () => {
    const token = localStorage.getItem('token');
    const {backendUrl} = useContext(StoreContext);
    const [announcements, setAnnouncements] = useState([]);
  
    useEffect(() => {
      fetchAnnouncements();
    }, []);
  
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/announcements/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-sky-50 to-sky-100 p-6">
    <div
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-sky-800 flex items-center gap-2">
          <FaBullhorn className="text-sky-600" /> Announcements
        </h1>
      </div>

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

export default StudentAnnouncement