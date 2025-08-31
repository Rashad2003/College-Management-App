import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPercentage, FaUserGraduate } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const StudentResult = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const {backendUrl} = useContext(StoreContext);
  const token = localStorage.getItem('token');
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchResults();
    if (user.role === "Student" || user.role === "Admin" || user.role === "Faculty" ) {
      fetchStudents();
    }
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/results/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/student/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 p-6">
      <div
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-3xl mt-15 font-bold text-sky-800 flex items-center gap-2 mb-8">
          <FaPercentage className="text-sky-600" /> Student Results
        </h1>

        {/* Results List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold text-sky-800 mb-4">Results</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50">
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Percentage</th>
                <th className="p-3 text-left">Uploaded By</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-3 text-gray-600">
                    No results available.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id} className="border-b border-sky-100">
                    <td className="p-3">{result.student?.name || "N/A"}</td>
                    <td className="p-3">{result.semester}</td>
                    <td className="p-3">{result.percentage}%</td>
                    <td className="p-3">{result.uploadedBy?.name || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentResult