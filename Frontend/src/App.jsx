import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "./context/StoreContext";
import { LogIn } from "./pages/LogIn";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { AddStudent } from "./pages/AddStudent";
import { Attendance } from "./pages/Attendance";
import { Report } from "./pages/Report";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProtectedRoute = ({ element, role }) => {
  
  const user = JSON.parse(localStorage.getItem("user"));
  if (role && user?.role !== role) return <Navigate to="/dashboard" />;

  return element;
};

function App() {
  const { token, setToken} = useContext(StoreContext);
  return (
    <Router>
      <ToastContainer />
      {token === "" ? (
        <LogIn setToken={setToken} />
      ) : (
        <>
      <Header />
      <div className="grid grid-cols-[1fr_5fr]">
        <div>
        <Sidebar/>
        </div>
        <div>
        <Routes>
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} role="Admin" />} />
        <Route path="/register" element={<ProtectedRoute element={<Register />} role="Admin" />} />
        <Route path="/students" element={<ProtectedRoute element={<AddStudent />} role="Admin" />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} />} />
        <Route path="/report" element={<ProtectedRoute element={<Report />} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
        </div>
      </div>
      </>
      )}
    </Router>
  );
}

export default App;
