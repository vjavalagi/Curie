import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurieLogo from "../assets/curie_no_background.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        username: form.username,
        password: form.password,
      });

      if (response.data.message === "Login successful") {
        setMessage("✅ Login successful!");
        setIsError(false);

        // Redirect after short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Login failed.");
      setIsError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-2xl dark:bg-neutral-900 dark:border-neutral-700 rounded-xl">
        <div className="text-center">
          <img src={CurieLogo} alt="Curie Logo" className="w-40 h-24 mx-auto my-4 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm dark:border-neutral-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm dark:border-neutral-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 text-center text-sm font-medium ${
                isError ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white rounded-lg bg-curieBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-700 dark:text-white">Don't have an account?</p>
          <button
            onClick={() => navigate("/createaccount")}
            className="mt-1 text-curieBlue hover:underline"
          >
            Click here to Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
