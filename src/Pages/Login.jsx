import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurieLogo from "../assets/curie_no_background.png";
import { useGlobal } from "../context/GlobalContext";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useGlobal();

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("API URL:", API_BASE_URL);
      const response = await axios.post(`${API_BASE_URL}/api/login`, form);
      if (response.data && response.data.user) {
        setUser({
          UserID: response.data.user.UserID,
          Email: response.data.user.Email,
          PhotoURL: response.data.user.PhotoURL,
        });

        setMessage({ text: "Login successful!", type: "success" });
        setTimeout(() => navigate("/landing"), 1000);
      } else {
        setMessage({ text: "Login failed. Please try again.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Invalid username or password", type: "error" });
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <div className="text-center">
          <img src={CurieLogo} alt="Curie Logo" className="w-40 h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-neutral-700 dark:text-white"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded dark:bg-neutral-700 dark:text-white"
            required
          />

          {message.text && (
            <div
              className={`text-sm text-center p-2 rounded mb-4 shadow ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <button className="w-full p-2 text-white bg-curieBlue rounded hover:bg-blue-700">
            Sign In
          </button>

          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
            Not a member?{" "}
            <a href="/createaccount" className="text-blue-500 hover:underline">
              Join today
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
