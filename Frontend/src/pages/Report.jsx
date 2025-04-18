import { useEffect, useState, useContext } from "react";
import { IoPrint } from "react-icons/io5";
import axios from "axios";
import { StoreContext } from "../context/storeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

export const Report = () => {
  const { backendUrl } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState("Class Report");

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentReport, setStudentReport] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch student list for search
  const fetchStudentsList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentsList(res.data.students || []);
    } catch (err) {
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudentsList();
  }, []);

  const filteredStudentList = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      s.register.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const fetchAttendanceReport = async () => {
    if (!fromDate || !toDate || !selectedClass) {
      return toast.error("Please select class and date range");
    }

    try {
      const res = await axios.get(`${backendUrl}/api/attendance/class-report`, {
        params: { fromDate, toDate, class: selectedClass },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setReportData(res.data.data);
      } else {
        toast.error("No attendance records found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch report");
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Class Attendance Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["No", "Name", "Reg No", "Class", "Total", "Present", "Absent", "%"]],
      body: reportData.map((entry, i) => [
        i + 1,
        entry.name,
        entry.register,
        entry.class,
        entry.totalPeriods,
        entry.presentCount,
        entry.totalPeriods - entry.presentCount,
        `${entry.percentage.toFixed(2)}%`,
      ]),
    });
    doc.save("class-report.pdf");
  };

  const handleStudentReportPrint = () => {
    const doc = new jsPDF();
    doc.text("Student Attendance Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["No", "Name", "Reg No", "Class", "Total", "Present", "Absent", "%"]],
      body: [
        [
          1,
          studentReport.name,
          studentReport.register,
          studentReport.class,
          studentReport.totalPeriods,
          studentReport.presentCount,
          studentReport.absentCount,
          `${studentReport.percentage.toFixed(2)}%`,
        ],
      ],
    });
    doc.save(`${studentReport.name}-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-sm md:text-lg">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setCurrentPage("Class Report")}
          className={`px-6 py-2 rounded-lg ${
            currentPage === "Class Report"
              ? "bg-purple-900 text-white"
              : "bg-white text-black border"
          }`}
        >
          Class Report
        </button>
        <button
          onClick={() => setCurrentPage("Student Report")}
          className={`px-6 py-2 rounded-lg ${
            currentPage === "Student Report"
              ? "bg-purple-900 text-white"
              : "bg-white text-black border"
          }`}
        >
          Student Report
        </button>
      </div>

      {currentPage === "Class Report" && (
        <div className="border p-3 md:p-5 lg:mx-[3rem] w-[75vw] overflow-x-scroll my-[1rem] bg-white shadow">
          <div className="flex justify-between">
            <p className="font-bold text-purple-900">Class Report</p>
            <IoPrint
              className="text-purple-900 text-[2rem] cursor-pointer"
              onClick={handlePrint}
            />
          </div>

          <div className="flex gap-8 mt-4 flex-wrap">
            <div className="flex flex-col">
              <label className="font-bold">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="outline-none border px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="outline-none border px-2 py-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">Class:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="outline-none border px-2 py-1"
              >
                <option value="">--Select--</option>
                <option value="Class A">Class A</option>
                <option value="Class B">Class B</option>
                <option value="Class C">Class C</option>
              </select>
            </div>
            <button
              className="bg-purple-700 text-white px-4 py-2 rounded self-end"
              onClick={fetchAttendanceReport}
            >
              Generate Report
            </button>
          </div>

          <table className="w-full border mt-6 text-sm text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">No.</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Register</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Total Periods</th>
                <th className="border p-2">Present</th>
                <th className="border p-2">Absent</th>
                <th className="border p-2">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((s, index) => (
                <tr key={s._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.register}</td>
                  <td className="border p-2">{s.class}</td>
                  <td className="border p-2">{s.totalPeriods}</td>
                  <td className="border p-2">{s.presentCount}</td>
                  <td className="border p-2">{s.totalPeriods - s.presentCount}</td>
                  <td className="border p-2">{s.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentPage === "Student Report" && (
        <div className="p-3 md:p-5 lg:mx-[3rem] my-[1rem] w-[75vw] overflow-x-scroll bg-white shadow border">
          <label className="font-bold">Search by Name, Register, Email:</label>
          <input
            type="text"
            value={studentSearchTerm}
            onChange={(e) => {
              setStudentSearchTerm(e.target.value);
              setSelectedStudentId(null);
              setStudentReport(null);
            }}
            className="border px-3 py-1 rounded mt-2 w-full"
            placeholder="Enter name, register no, or email"
          />

          {studentSearchTerm && !selectedStudentId && (
            <table className="w-full border text-center mt-4 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Select</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Register</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudentList.map((s) => (
                  <tr key={s._id}>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={selectedStudentId === s._id}
                        onChange={async () => {
                          setSelectedStudentId(s._id);
                          try {
                            const res = await axios.get(
                              `${backendUrl}/api/attendance/student-report/${s._id}`
                            );
                            setStudentReport(res.data.data);
                            console.log(res);
                          } catch (err) {
                            toast.error("Failed to load student report");
                          }
                        }}
                      />
                    </td>
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2">{s.register}</td>
                    <td className="border p-2">{s.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {studentReport && (
            <div className="mt-6 border p-4 w-[75vw] overflow-x-scroll bg-white shadow">
              <div className="flex justify-between items-center">
                <h3 className="text-purple-900 font-bold text-lg">Student Report</h3>
                <IoPrint
                  className="text-purple-900 text-[2rem] cursor-pointer"
                  onClick={handleStudentReportPrint}
                />
              </div>
              <table className="w-full border mt-4 text-sm text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Register</th>
                    <th className="border p-2">Class</th>
                    <th className="border p-2">Total Periods</th>
                    <th className="border p-2">Present</th>
                    <th className="border p-2">Absent</th>
                    <th className="border p-2">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">{studentReport.name}</td>
                    <td className="border p-2">{studentReport.register}</td>
                    <td className="border p-2">{studentReport.class}</td>
                    <td className="border p-2">{studentReport.totalPeriods}</td>
                    <td className="border p-2">{studentReport.presentCount}</td>
                    <td className="border p-2">{studentReport.absentCount}</td>
                    <td className="border p-2">{studentReport.percentage.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
