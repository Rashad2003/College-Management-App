import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaCalendarAlt, FaUpload, FaFolder, FaFolderOpen } from "react-icons/fa";
import { StoreContext } from '../context/StoreContext';

const StudentTimetable = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');
  const {backendUrl} = useContext(StoreContext);
  const [timetables, setTimetables] = useState([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("1"); // Default to 1st year
  const [section, setSection] = useState("A"); // Default to Section A
  const [examType, setExamType] = useState("CAT1"); // Default to CAT1
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState({}); // Track expanded/collapsed state for departments
  const [expandedYears, setExpandedYears] = useState({}); // Track expanded/collapsed state for years
  const [expandedSections, setExpandedSections] = useState({}); // Track expanded/collapsed state for sections

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/timetable/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimetables(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching timetables:", error);
    }
  };

  // Group timetables by department, year, section, and examType
  const groupedTimetables = timetables.reduce((acc, timetable) => {
    if (!acc[timetable.department]) {
      acc[timetable.department] = {};
    }
    if (!acc[timetable.department][timetable.year]) {
      acc[timetable.department][timetable.year] = {};
    }
    if (!acc[timetable.department][timetable.year][timetable.section]) {
      acc[timetable.department][timetable.year][timetable.section] = {};
    }
    if (!acc[timetable.department][timetable.year][timetable.section][timetable.examType]) {
      acc[timetable.department][timetable.year][timetable.section][timetable.examType] = [];
    }
    acc[timetable.department][timetable.year][timetable.section][timetable.examType].push(timetable);
    return acc;
  }, {});

  // Toggle expanded state for a department
  const toggleDepartment = (department) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department], // Toggle the expanded state
    }));
  };

  // Toggle expanded state for a year
  const toggleYear = (department, year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [`${department}-${year}`]: !prev[`${department}-${year}`], // Toggle the expanded state
    }));
  };

  // Toggle expanded state for a section
  const toggleSection = (department, year, section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [`${department}-${year}-${section}`]: !prev[`${department}-${year}-${section}`], // Toggle the expanded state
    }));
  };
  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-sky-50 to-sky-100 p-6">
      <div
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-sky-800 flex items-center gap-2 mb-8">
          <FaCalendarAlt className="text-sky-600" /> Exam Timetables
        </h1>

        <div className="space-y-6">
          {Object.keys(groupedTimetables).length === 0 ? (
            <p className="text-center text-gray-600">No timetables available.</p>
          ) : (
            Object.keys(groupedTimetables).map((department) => (
              <div
                key={department}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                {/* Department Folder Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDepartment(department)}
                >
                  <h2 className="text-2xl font-bold text-sky-800 flex items-center gap-2">
                    {expandedDepartments[department] ? (
                      <FaFolderOpen className="text-sky-600" />
                    ) : (
                      <FaFolder className="text-sky-600" />
                    )}
                    {department} Department
                  </h2>
                  <span className="text-sky-600">
                    {expandedDepartments[department] ? "▼" : "▶"}
                  </span>
                </div>

                {/* Years List (Conditionally Rendered) */}
                {expandedDepartments[department] && (
                  <div className="mt-4 space-y-4">
                    {Object.keys(groupedTimetables[department]).map((year) => (
                      <div
                        key={year}
                        className="bg-sky-50 p-4 rounded-lg"
                      >
                        {/* Year Folder Header */}
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleYear(department, year)}
                        >
                          <h3 className="text-xl font-bold text-sky-800 flex items-center gap-2">
                            {expandedYears[`${department}-${year}`] ? (
                              <FaFolderOpen className="text-sky-600" />
                            ) : (
                              <FaFolder className="text-sky-600" />
                            )}
                            {year} Year
                          </h3>
                          <span className="text-sky-600">
                            {expandedYears[`${department}-${year}`] ? "▼" : "▶"}
                          </span>
                        </div>

                        {/* Sections List (Conditionally Rendered) */}
                        {expandedYears[`${department}-${year}`] && (
                          <div className="mt-4 space-y-4">
                            {Object.keys(groupedTimetables[department][year]).map((section) => (
                              <div
                                key={section}
                                className="bg-sky-100 p-4 rounded-lg"
                              >
                                {/* Section Folder Header */}
                                <div
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => toggleSection(department, year, section)}
                                >
                                  <h4 className="text-lg font-bold text-sky-800 flex items-center gap-2">
                                    {expandedSections[`${department}-${year}-${section}`] ? (
                                      <FaFolderOpen className="text-sky-600" />
                                    ) : (
                                      <FaFolder className="text-sky-600" />
                                    )}
                                    Section {section}
                                  </h4>
                                  <span className="text-sky-600">
                                    {expandedSections[`${department}-${year}-${section}`] ? "▼" : "▶"}
                                  </span>
                                </div>

                                {/* Exam Types List (Conditionally Rendered) */}
                                {expandedSections[`${department}-${year}-${section}`] && (
                                  <div className="mt-4 space-y-4">
                                    {Object.keys(groupedTimetables[department][year][section]).map((examType) => (
                                      <div
                                        key={examType}
                                        className="bg-sky-200 p-4 rounded-lg"
                                      >
                                        <h5 className="text-md font-bold text-sky-800">{examType}</h5>
                                        <div className="mt-2 space-y-2">
                                          {groupedTimetables[department][year][section][examType].map((timetable) => (
                                            <div key={timetable._id} className="bg-white p-4 rounded-lg">
                                              <h6 className="text-sm font-bold text-sky-800">{timetable.title}</h6>
                                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                <span>📅 {new Date(timetable.createdAt).toLocaleString()}</span>
                                              </div>
                                              <a
                                                href={`http://localhost:5000/${timetable.pdfFile}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition duration-300"
                                              >
                                                View Timetable 📄
                                              </a>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
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
  )
}

export default StudentTimetable