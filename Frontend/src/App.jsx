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
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TeacherList } from "./pages/TeacherList";
import { StudentList } from "./pages/StudentList";
import AddSubject from "./pages/AddSubject";

const ProtectedRoute = ({ element, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/attendance" replace />;

  return element;
};

// Layout with sidebar + header
const Layout = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-[1fr_5fr]">
        <Sidebar />
        <div>
          <Outlet />
        </div>
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
        <Route path="/login" element={<LogIn setToken={setToken} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Protected Routes inside Layout */}
        <Route element={<Layout />}>
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
            path="/subject"
            element={<ProtectedRoute element={<AddSubject />} role="Admin" />}
          />
          <Route
            path="/attendance"
            element={<ProtectedRoute element={<Attendance />} />}
          />
          <Route
            path="/report"
            element={<ProtectedRoute element={<Report />} />}
          />
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
