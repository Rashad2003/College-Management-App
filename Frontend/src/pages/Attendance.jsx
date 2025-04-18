import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

export const Attendance = () => {
  const { backendUrl } = useContext(StoreContext);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    class: "",
    date: "",
  });

  const [attendance, setAttendance] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  const classOptions = ["Class A", "Class B", "Class C"];
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (formData.class && formData.date) {
      fetchAttendanceData();
    }
  }, [formData.class, formData.date]);

  const fetchAttendanceData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/attendance/fetch`, {
        params: {
          class: formData.class,
          date: formData.date,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.exists) {
        const saved = {};
        res.data.attendance.students.forEach((record) => {
          saved[record.studentId] = record.periods.map((p) => p.status);
        });
        setAttendance(saved);
        setStudents(res.data.attendance.students.map((s) => ({
          _id: s.studentId,
          name: s.name,
          register: s.register,
        })));
      } else {
        fetchStudents(formData.class);
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
      const filtered = res.data.students.filter(
        (s) => s.class.toLowerCase() === cls.toLowerCase()
      );

      setStudents(filtered);
      const initial = {};
      filtered.forEach((s) => {
        initial[s._id] = Array(8).fill("Present");
      });
      setAttendance(initial);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
    }
  };

  const handlePeriodChange = (studentId, periodIndex, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId].map((val, i) =>
        i === periodIndex ? value : val
      ),
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      class: formData.class,
      subject: formData.subject,
      date: formData.date,
      students: Object.entries(attendance).map(([id, periods]) => ({
        studentId: id,
        periods: periods.map((status, i) => ({
          periodNumber: i + 1,
          status,
        })),
      })),
    };

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

  const handleSendMessageClick = (student) => {
    setSelectedStudent(student);
  
    const absentPeriods = attendance[student._id]
      ?.map((status, index) => (status === "Absent" ? index + 1 : null))
      .filter((p) => p !== null);
  
    const absentText = absentPeriods.length > 0
      ? `for Period(s): ${absentPeriods.join(", ")}`
      : "";
  
    const defaultMsg = `Dear Parent, your child ${student.name} was absent on ${formData.date} ${absentText}.`;
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
      <h2 className="text-lg md:text-2xl font-bold text-purple-800 mb-6 ">Mark Attendance</h2>

      <div className="flex gap-6 mb-6 flex-wrap">
        <div>
          <label className="block mb-1 font-semibold">Class</label>
          <select
            value={formData.class}
            onChange={(e) =>
              setFormData({ ...formData, class: e.target.value })
            }
            className="border px-4 py-2 rounded"
          >
            <option value="">--Select--</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
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
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="border p-2">{`Class ${i + 1}`}</th>
                ))}
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.register}</td>
                  {[...Array(8)].map((_, i) => (
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
                          <option value="Present" className="bg-green-400"></option>
                          <option value="Absent" className="bg-red-400"></option>
                          <option value="Late" className="bg-yellow-400"></option>
                        </select>
                      </div>
                    </td>
                  ))}
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
    </div>
  );
};
