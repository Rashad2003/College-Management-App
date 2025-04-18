import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import { toast } from "react-toastify";

export const LogIn = ({setToken}) => {
  const { backendUrl } = useContext(StoreContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <div className="border p-8 bg-white md:w-[500px] md:h-[400px] rounded-[2rem] shadow-md">
          <h1 className="text-center font-bold text-base md:text-2xl mb-4 text-purple-900">Attendace Management System</h1>
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
                type="password"
                className="border"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <button type="submit" className="w-full mt-4 bg-purple-900 text-white py-2 mt-5">
              Login
            </button>
            <div className="text-center mt-4">
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};