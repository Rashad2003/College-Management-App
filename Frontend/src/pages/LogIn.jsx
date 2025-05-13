import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

export const LogIn = ({setToken}) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post( backendUrl + "/api/user/forgot-password", { email: forgotEmail });
      if (res.data.success) {
        toast.success("Reset link sent to your email");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        navigate("/dashboard");
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100 text-sm md:text-lg">
        <div className="border p-8 bg-white md:w-[500px] md:h-[400px] rounded-2xl shadow-2xl">
          <h1 className="text-center font-bold text-base md:text-2xl mb-4 text-purple-900">Attendance Management System</h1>
          <h1 className="text-center font-bold text-base md:text-2xl">Login</h1>
          <form onSubmit={onSubmitHandler}>
            <div className="flex flex-col mb-4">
              <label className="mb-2 font-bold" htmlFor="email">Email:</label>
              <input
                type="email"
                className="border"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-bold" htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="border"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <span
          className="relative left-[13.5rem] bottom-[1.1rem] md:left-[25.5rem] md:bottom-[1.5rem] text-gray-600 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
            </div>
            <button type="submit" className="w-full mt-4 bg-purple-900 text-white py-2 mt-5">
              Login
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-purple-700 hover:underline" onClick={() => {
            setShowForgotPopup(true);
            setRetrievedPassword("");
            setForgotEmail("");
          }}>
                Forgot Password?
              </p>
            </div>            
          </form>
        </div>
      </div>
      {showForgotPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4 text-purple-700">Forgot Password</h3>
            <label className="block mb-2 text-sm">Enter your email:</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded"
                onClick={handleForgotPassword}
              >
                Send Link
              </button>
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setShowForgotPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
