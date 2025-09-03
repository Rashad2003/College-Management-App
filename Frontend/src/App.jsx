import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "./context/StoreContext";
import { LogIn } from "./pages/LogIn";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { AddStudent } from "./pages/AddStudent";
import { Attendance } from "./pages/Attendance";
import { Report } from "./pages/Report";
import { ResetPassword } from "./pages/ResetPassword";
import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TeacherList } from "./pages/TeacherList";
import { StudentList } from "./pages/StudentList";
import { Course } from "./pages/Course";
import { FacultyDashboard } from "./pages/FacultyDashboard";
import { Department } from "./pages/Department";
import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import Student from "./pages/Student";
import FacultyAnnouncement from "./pages/FacultyAnnouncement";
import FacultyTimetable from "./pages/FacultyTimetable";
import FacultyResult from "./pages/FacultyResult";
import FacultyStudymaterials from "./pages/FacultyStudymaterials";
import StudentAnnouncement from "./pages/StudentAnnouncement";
import StudentTimetable from "./pages/StudentTimetable";
import StudentResult from "./pages/StudentResult";
import StudentStudymaterials from "./pages/StudentStudymaterials";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import CollegeRegister from "./pages/CollegeRegister";

const ProtectedRoute = ({ element, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return element;
};

// Layout with sidebar + header
const Layout = () => {
  return (
    <>
      <Header />
      <div>
          <Outlet />
      </div>
    </>
  );
};

function App() {
  const { setToken } = useContext(StoreContext);

  return (
    <Router>
      <ToastContainer />

      <Routes>
        {/* Login Route (No header/sidebar) */}
        <Route path="/Home" element={<Home />} />
        <Route path="/Home2" element={<Home2 />} />
        <Route path="/login" element={<LogIn setToken={setToken} />} />
        <Route path="/collegeRegister" element={<CollegeRegister setToken={setToken} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
        <Route path="/admin" element={<Admin />} role="Admin" />
        <Route path="/faculty" element={<Faculty />} role="Faculty" />
        <Route path="/student" element={<Student />} role="Student" />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} role="Admin" />}
          />
          <Route
            path="/register"
            element={<ProtectedRoute element={<Register />} role="Admin" />}
          />
          <Route
            path="/students"
            element={<ProtectedRoute element={<AddStudent />} role="Admin" />}
          />
          <Route
            path="/course"
            element={<ProtectedRoute element={<Course />} role="Admin" />}
          />
          <Route
            path="/attendance"
            element={<ProtectedRoute element={<Attendance />} />}
          />
          <Route
            path="/faculty/dashboard"
            element={<ProtectedRoute element={<FacultyDashboard />} />}
          />
          <Route path="/faculty/announcement" element={<ProtectedRoute element={<FacultyAnnouncement />} role={"Admin" & "Faculty"} />} />
          <Route path="/faculty/timetable" element={<ProtectedRoute element={<FacultyTimetable />} role={"Admin" & "Faculty"} />} />
          <Route path="/faculty/result" element={<ProtectedRoute element={<FacultyResult />} role={"Admin" & "Faculty"} />} />
          <Route path="/faculty/studymaterials" element={<ProtectedRoute element={<FacultyStudymaterials />} role={"Admin" & "Faculty"} />} />
          
          <Route path="/student/announcement" element={<ProtectedRoute element={<StudentAnnouncement />} role="Student" />} />
          <Route path="/student/timetable" element={<ProtectedRoute element={<StudentTimetable />} role="Student" />} />
          <Route path="/student/result" element={<ProtectedRoute element={<StudentResult />} role="Student" />} />
          <Route path="/student/studymaterials" element={<ProtectedRoute element={<StudentStudymaterials />} role="Student" />} />

          <Route
            path="/report"
            element={<ProtectedRoute element={<Report />} />}
          />
          <Route path="/department" element={<Department />} />
          <Route path="/teacherList" element={<TeacherList />} />
          <Route path="/teacherList" element={<TeacherList />} />
        <Route path="/studentList" element={<StudentList />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
