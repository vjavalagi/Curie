import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
    previewUrl: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const photo = e.target.files[0];
    if (photo) {
      setForm((prev) => ({
        ...prev,
        photo,
        previewUrl: URL.createObjectURL(photo),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, photo } = form;

    if (!username || !email || !password || !confirmPassword || !photo) {
      setMessage("❌ All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      let photoUrl = "";

      const { data } = await axios.get("http://localhost:5001/api/s3-url", {
        params: { filename: `ProfilePictures/${photo.name}` },
      });

      await axios.put(data.url, photo, {
        headers: { "Content-Type": photo.type },
      });

      photoUrl = data.url.split("?")[0];

      const response = await axios.post("http://localhost:5001/api/create-user", {
        username,
        email,
        password,
        photo_url: photoUrl,
      });

      if (response.data.message) {
        setMessage("✅ Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ " + (response.data.error || "Failed to create account."));
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ An error occurred while creating the account.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm dark:text-white">Username</label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm dark:text-white">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
            />
            {form.previewUrl && (
              <img
                src={form.previewUrl}
                alt="Preview"
                className="w-24 h-24 mt-2 rounded-full object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Account
          </button>
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
