import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurieLogo from "../assets/curie_no_background.png";
import { useGlobal } from "../context/GlobalContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useGlobal();

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/login", form);
      if (response.data && response.data.user) {
        setUser({
          UserID: response.data.user.UserID,
          Email: response.data.user.Email,
          PhotoURL: response.data.user.PhotoURL,  // ✅ make sure this is included
        });
        
        console.log("User INFO :", response.data.user);
        
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/"), 1000); // Redirect home
      } else {
        setMessage("❌ Login failed");
      }
    } catch (error) {
      setMessage("❌ Invalid username or password");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
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
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          {message && <p className="text-sm mb-2 text-center">{message}</p>}
          <button className="w-full p-2 text-white bg-curieBlue rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
