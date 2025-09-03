import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPercentage, FaUserGraduate } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";

const FacultyResult = () => {
   const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');
  const {backendUrl} = useContext(StoreContext);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState("");
  const [percentage, setPercentage] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResults();
    if (user && (user.role === "Faculty" || user.role === "Admin")) {
      fetchStudents();
    }
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/result/get", {
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
      console.log(res.data);
      setStudents(res.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleUploadResult = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !semester || !percentage) {
      return alert("Please fill all fields");
    }

    setLoading(true);
    try {
      await axios.post(
        backendUrl + "/api/result/add",
        { studentId: selectedStudent, semester, percentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSemester("");
      setPercentage("");
      setSelectedStudent("");
      fetchResults();
    } catch (error) {
      console.error("Error uploading result:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
      <div
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-yellow-800 flex items-center gap-2 mb-8">
          <FaPercentage className="text-yellow-600" /> Student Results
        </h1>

        {/* Upload Result Form (Faculty Only) */}
        {(user.role === "Faculty" || user.role === "Admin") && (
          <form
            onSubmit={handleUploadResult}
            className="bg-white p-6 rounded-2xl shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">Upload New Result</h2>
            <select
              className="w-full p-3 mb-4 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:outline-none"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
            <input
              className="w-full p-3 mb-4 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:outline-none"
              type="text"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 rounded-lg border border-yellow-300 focus:border-yellow-500 focus:outline-none"
              type="number"
              min="0"
              max="100"
              placeholder="Percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Result"}
            </button>
          </form>
        )}

        {/* Results List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Results</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-50">
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
                  <tr key={result._id} className="border-b border-yellow-100">
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

export default FacultyResult