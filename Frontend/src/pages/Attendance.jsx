import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

export const Attendance = () => {
  const { backendUrl } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState("Mark Attendance");
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    department: "",
    year: "",
    section: "",
    semester: "",
    subject: "",
    period: "",
    date: "",
  });

  const [attendance, setAttendance] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
const [subjects, setSubjects] = useState([]);
const [attendanceData, setAttendanceData] = useState(null);
const [studentsData, setStudentsData] = useState([]);

  useEffect(() => {
    if (formData.department && formData.year && formData.section && formData.date) {
      fetchAttendanceData();
      viewAttendance();
    }
  }, [formData.department, formData.year, formData.section, formData.date]);

  useEffect(() => {
    if (formData.department && formData.year && formData.semester) {
    fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [formData.department, formData.year, formData.semester]);

  const fetchSubjects = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/subject/list", {
          params: {
            department:formData.department,
            year:formData.year,
            semester:formData.semester,
          },
        });
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
  };
  

  const fetchAttendanceData = async () => {
    const dateString = new Date(formData.date).toISOString().split('T')[0];
    try {
      const res = await axios.get(`${backendUrl}/api/attendance/fetch`, {
        params: {
          department: formData.department,
          year: formData.year,
          section: formData.section,
          semester: formData.semester,
          date: dateString,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)

      if (res.data.success) {
        // const saved = {};
        // res.data.students.forEach((record) => {
        //   const periodRecord = record.periods.find(
        //     (p) => p.periodNumber === formData.period
        //   );
        //   saved[record.studentId] = periodRecord ? periodRecord.status : "Present";
        // });
        // setAttendance(saved);
        setStudents(res.data.students);
      } else {
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading attendance");
    }
  };

  const fetchStudents = async (cls) => {
    try {
      const res = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      const filtered = res.data.students.filter(
        (s) =>
          s.department.toLowerCase() === formData.department.toLowerCase() &&
          s.year.toLowerCase() === formData.year.toLowerCase() &&
          s.section.toLowerCase() === formData.section.toLowerCase()
      );

      setStudents(filtered);
      const initial = {};
      filtered.forEach((s) => {
        initial[s._id] = "Present";
      });
      setAttendance(initial);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
    }
  };

  const handlePeriodChange = (studentId, value) => {
    console.log("Changed status:", studentId, value); 
    setAttendance((prev) => ({
      ...prev,
      // [studentId]: prev[studentId].map((val, i) =>
      //   i === periodIndex ? value : val
      // ),
      [studentId]: value,
    }));
  };

  const handleSubmit = async () => {
      const payload = {
    department: formData.department,
    year: formData.year,
    section: formData.section,
    semester: formData.semester,
    date: formData.date,
    students: Object.entries(attendance).map(([id, status]) => {
      const student = students.find((s) => s._id === id);
      return {
        studentId: id,
        name: student?.name || "",
        register: student?.register || "",
        periods: [
          {
            periodNumber: String(formData.period),
            subject: formData.subject,
            status,
          },
        ],
      };
    }),
  };
    console.log("Submitting attendance payload:", payload);

    try {
      const res = await axios.post(`${backendUrl}/api/attendance/mark`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Attendance saved!");
      } else {
        toast.error("Error saving attendance");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  };

  const viewAttendance = async () => {
    const dateString = new Date(formData.date).toISOString().split('T')[0];
    try {
      const res = await axios.get(backendUrl + "/api/attendance/view", {
        params: {
          department: form.department,
          year: form.year,
          section: form.section,
          semester: form.semester,
          date: dateString,
        },
      });
      console.log("Sending date:", formData.date, typeof formData.date);
      console.log(res);
      if (res.data.success) {
        setStudentsData(res.data.students);
      } else {
        toast.error("No attendance found");
        setAttendanceData(null);
      }
    } catch (err) {
      toast.error("Error fetching data");
    }
  };
  

  const handleSendMessageClick = (student) => {
    setSelectedStudent(student);
  
    const studentAttendance = attendance[student._id] || {}; // ensure it's at least an object
  
    const absentPeriods = Object.entries(studentAttendance)
      .filter(([_, status]) => status === "Absent")
      .map(([period]) => period); // keys are the period numbers
  
    const absentText = absentPeriods.length > 0
      ? `for Period(s): ${absentPeriods.join(", ")}`
      : "";
  
    const defaultMsg = `Dear Parent, your child ${student.name} was absent on ${formData.date} ${absentText} for Periods(${formData.period}).`;
  
    console.log(student.name);
    setMessage(defaultMsg);
    setShowPopup(true);
  };
  
  

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
  
    try {
      const res = await axios.post(
        `${backendUrl}/api/attendance/send`,
        {
          studentId: selectedStudent._id,
          message: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (res.data.success) {
        toast.success(`Message sent to ${selectedStudent.name}'s parent.`);
        setShowPopup(false);
        setMessage("");
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Send Message Error:", error);
      toast.error("Something went wrong while sending the message.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setCurrentPage("Mark Attendance")}
          className={`px-6 py-2 rounded-lg ${
            currentPage === "Mark Attendance"
              ? "bg-purple-900 text-white"
              : "bg-white text-black border"
          }`}
        >
          Mark Attendance
        </button>
        <button
          onClick={() => setCurrentPage("View Attendance")}
          className={`px-6 py-2 rounded-lg ${
            currentPage === "View Attendance"
              ? "bg-purple-900 text-white"
              : "bg-white text-black border"
          }`}
        >
          View Attendance
        </button>
      </div>

      {currentPage === "Mark Attendance" && (
        <>
      <h2 className="text-lg md:text-2xl font-bold text-purple-800 mb-6 ">Mark Attendance</h2>
      <div className="flex gap-6 mb-6 flex-wrap">
        <div>
          <label className="block mb-1 font-semibold">Department</label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
            <option value="">--Select--</option>
            <option value="IT">IT</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Year</label>
          <select
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
            <option value="">--Select--</option>
            <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
          </select>
        </div>
        <div>
        <label className="block mb-1 font-semibold">Semester</label>
        <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="border px-4 py-2 rounded">
  <option value="">Select Semester</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
</select>
        </div>
        <div>
        <label className="block mb-1 font-semibold">Subject</label>
        <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="border px-4 py-2 rounded w-[10rem]">
  <option value="">Select Subject</option>
  {subjects.map(subj => (
    <option key={subj._id} value={subj.name}>
      {subj.name}
    </option>
  ))}
</select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Section</label>
          <select
            value={formData.section}
            onChange={(e) =>
              setFormData({ ...formData, section: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
  <option value="">--Select Section--</option>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
          </select>
        </div>
        <div>
        <label className="block mb-1 font-semibold">Period</label>
        <select value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="border px-4 py-2 rounded">
 <option value="">Select Period</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
  {/* {[...Array(8)].map((_, i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))} */}
</select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="border px-4 py-2 rounded"
          />
        </div>
      </div>

      {students.length > 0 && (
        <div className="overflow-auto w-[75vw]">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-purple-100 text-center">
                <th className="border p-2">Name</th>
                <th className="border p-2">Register No</th>
                <th className="border p-2">{`Period ${formData.period}`}</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.register}</td>
                  <td className="border p-2">
                  <select
  value={attendance[student._id] || "Present"}
  onChange={(e) => handlePeriodChange(student._id, e.target.value)}
  className="appearance-none w-6 h-6 rounded-full cursor-pointer border-none focus:outline-none"
  style={{
    backgroundColor:
      attendance[student._id] === "Present"
        ? "#4ade80"
        : attendance[student._id] === "Absent"
        ? "#f87171"
        : "#facc15",
  }}
>
  <option value="Present" className="bg-green-400 text-center text-bold">P</option>
  <option value="Absent" className="bg-red-400 text-center text-bold">A</option>
  <option value="Late" className="bg-yellow-400 text-center text-bold">L</option>
</select>

                </td>
                  {/* {[...Array(8)].map((_, i) => (
                    <td key={i} className="border p-2">
                      <div className="flex justify-center">
                        <select
                          value={attendance[student._id]?.[i] || "Present"}
                          onChange={(e) =>
                            handlePeriodChange(student._id, i, e.target.value)
                          }
                          className="appearance-none w-6 h-6 rounded-full cursor-pointer border-none focus:outline-none"
                          style={{
                            backgroundColor:
                              attendance[student._id]?.[i] === "Present"
                                ? "#4ade80"
                                : attendance[student._id]?.[i] === "Absent"
                                ? "#f87171"
                                : "#facc15",
                          }}
                        >
                          <option value="Present" className="bg-green-400 text-center text-bold">P</option>
                          <option value="Absent" className="bg-red-400 text-center text-bold">A</option>
                          <option value="Late" className="bg-yellow-400 text-center text-bold">L</option>
                        </select>
                      </div>
                    </td>
                  ))} */}
                  <td className="border p-2">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleSendMessageClick(student)}
                    >
                      Send Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            className="bg-purple-700 text-white px-10 py-2 rounded hover:bg-purple-800"
            onClick={handleSubmit}
          >
            Submit Attendance
          </button>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h3 className="font-bold mb-2">
              Send Message to {selectedStudent?.name}
            </h3>
            <textarea
              rows={4}
              className="w-full border p-2 mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 px-4 py-1 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="bg-blue-600 px-4 py-1 rounded text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
      {currentPage === "View Attendance" && (
          <>
          <h2 className="text-lg md:text-2xl font-bold text-purple-800 mb-6 ">View Attendance</h2>
          <div className="flex gap-6 mb-6 flex-wrap">
            <div>
              <label className="block mb-1 font-semibold">Department</label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="border px-4 py-2 rounded"
              >
                <option value="">--Select--</option>
                <option value="IT">IT</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Year</label>
              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="border px-4 py-2 rounded"
              >
                <option value="">--Select--</option>
                <option value="1st">1st</option>
      <option value="2nd">2nd</option>
      <option value="3rd">3rd</option>
      <option value="4th">4th</option>
              </select>
            </div>
            <div>
            <label className="block mb-1 font-semibold">Semester</label>
            <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="border px-4 py-2 rounded">
      <option value="">Select Semester</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
    </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Section</label>
              <select
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="border px-4 py-2 rounded"
              >
      <option value="">--Select Section--</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="border px-4 py-2 rounded"
              />
            </div>
            <div>
            <button
              className="bg-purple-700 text-white px-4 py-2 rounded self-end mx-auto mt-[1.8rem]"
              onClick={fetchAttendanceData}
            >
              View Attendance
            </button>
            </div>
          </div>
    
          {students.length > 0 && (
            <div className="overflow-auto w-[75vw]">
              <table className="w-full border text-sm">
  <thead>
    <tr className="bg-purple-100 text-center">
      <th className="border p-2">Name</th>
      <th className="border p-2">Register No</th>
      {[...Array(8)].map((_, i) => (
        <th className="border p-2" key={i}>Period {i + 1}</th>
      ))}
    </tr>
  </thead>
  <tbody>
  {students.map((student) => (
      <tr key={student.studentId} className="text-center">
        <td className="border p-2">{student.name}</td>
        <td className="border p-2">{student.register}</td>
        {student.periodsStatus?.map((status, i) => {
  let short = "-";
  let bgClass = "bg-gray-400";

  if (status === "Present") {
    short = "P";
    bgClass = "bg-green-400";
  } else if (status === "Absent") {
    short = "A";
    bgClass = "bg-red-400";
  } else if (status === "Late") {
    short = "L";
    bgClass = "bg-orange-400";
  }

  return (
    <td key={i} className="border p-2">
      <div className={`${bgClass} appearance-none rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer border-none focus:outline-non`}>
        {short}
      </div>
    </td>
  );
})}
      </tr>
    ))}
  </tbody>
</table>

            </div>
          )}
          </>
      )}
    </div>
  );
};