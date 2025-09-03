import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaBookOpen, FaUpload, FaFolder, FaFolderOpen } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const FacultyStudymaterials = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');
  const {backendUrl} = useContext(StoreContext);
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("1"); // Default to 1st year
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});
  const [course, setCourse] = useState([]);

  useEffect(() => {
    fetchMaterials();
    fetchCourse();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/studyMaterial/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(res.data);
    } catch (error) {
      console.error("Error fetching study materials:", error);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("title", title);
    formData.append("department", department);
    formData.append("year", year); // Add year field

    try {
      await axios.post(backendUrl + "/api/studyMaterial/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDepartment("All");
      setYear("1"); // Reset year to default
      setFile(null);
      fetchMaterials();
    } catch (error) {
      console.error("Error uploading study material:", error);
    } finally {
      setLoading(false);
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

  // Group materials by year
  const groupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.year]) {
      acc[material.year] = [];
    }
    acc[material.year].push(material);
    return acc;
  }, {});

  // Toggle expanded state for a year
  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year], // Toggle the expanded state
    }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
    <div
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <h1 className="text-3xl font-bold text-red-800 flex items-center gap-2 mb-8">
        <FaBookOpen className="text-red-600" /> Study Materials
      </h1>

      {/* Upload Study Material Form (Faculty Only) */}
      {(user.role === "Faculty" || user.role === "Admin") && (
        <form
          onSubmit={handleUploadMaterial}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-red-800 mb-4">Upload New Study Material</h2>
          <input
            className="w-full p-3 mb-4 rounded-lg border border-red-300 focus:border-red-500 focus:outline-none"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="w-full p-3 mb-4 rounded-lg border border-red-300 focus:border-red-500 focus:outline-none"
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
          <select
            className="w-full p-3 mb-4 rounded-lg border border-red-300 focus:border-red-500 focus:outline-none"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <div className="flex items-center gap-2 mb-4">
            <input
              className="w-full p-3 rounded-lg border border-red-300 focus:border-red-500 focus:outline-none"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FaUpload /> {loading ? "Uploading..." : "Upload Study Material"}
          </button>
        </form>
      )}

      {/* Study Materials List (Grouped by Year) */}
      <div className="space-y-6">
        {Object.keys(groupedMaterials).length === 0 ? (
          <p className="text-center text-gray-600">No study materials available.</p>
        ) : (
          Object.keys(groupedMaterials).map((year) => (
            <div
              key={year}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              {/* Year Folder Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleYear(year)}
              >
                <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2">
                  {expandedYears[year] ? (
                    <FaFolderOpen className="text-red-600" />
                  ) : (
                    <FaFolder className="text-red-600" />
                  )}
                  {year} Year
                </h2>
                <span className="text-red-600">
                  {expandedYears[year] ? "▼" : "▶"}
                </span>
              </div>

              {/* Study Materials List (Conditionally Rendered) */}
              {expandedYears[year] && (
                <div className="mt-4 space-y-4">
                  {groupedMaterials[year].map((material) => (
                    <div key={material._id} className="bg-red-50 p-4 rounded-lg">
                      <h3 className="text-xl font-bold text-red-800">{material.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>📅 {new Date(material.createdAt).toLocaleString()}</span>
                      </div>
                      <a
                        href={`http://localhost:5000/${material.pdfFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        View Study Material 📄
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
};

export default FacultyStudymaterials