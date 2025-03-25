import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure react-router-dom is installed

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    if (!form.acceptedTerms) {
      alert("You must accept the terms and conditions.");
      return;
    }

    // Save user credentials in localStorage (Temporary authentication method)
    localStorage.setItem("user", JSON.stringify({ username: form.username, password: form.password }));

    alert("Account created successfully! Redirecting to login...");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create Account</h1>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-neutral-400">
          Already have an account? 
          <a href="/login" className="text-blue-600 hover:underline dark:text-blue-500"> Sign in here</a>
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm dark:text-white">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              value={form.username} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm dark:text-white">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={form.password} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm dark:text-white">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              required 
              value={form.confirmPassword} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="terms" 
              name="acceptedTerms" 
              checked={form.acceptedTerms} 
              onChange={handleChange} 
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm dark:text-white">
              I accept the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">Terms and Conditions</a>
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full p-2 mt-4 text-white rounded-md bg-curieBlue hover:bg-blue-700 focus:outline-none"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
