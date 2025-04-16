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

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      let photoUrl = "";

      if (photo) {
        // Get a presigned URL from backend
        const { data } = await axios.get("http://localhost:5001/api/s3-url", {
          params: { filename: `ProfilePictures/${photo.name}` },
        });

        // Upload to S3
        await axios.put(data.url, photo, {
          headers: { "Content-Type": photo.type },
        });

        photoUrl = data.url.split("?")[0];
      }

      // Send data to backend to create user
      const response = await axios.post("http://localhost:5001/api/create-user", {
        username,
        email,
        password,
        photo_url: photoUrl,
      });

      if (response.data.message) {
        setMessage("✅ Account created successfully!");
        setTimeout(() => navigate("/"), 1500);
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
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-neutral-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
            >
              Sign in here
            </span>
          </div>

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
  <label className="block text-sm dark:text-white mb-1">Profile Picture</label>

  <div className="flex flex-wrap items-center gap-3 sm:gap-5">
    <div className="group">
      <label
        htmlFor="profile-upload"
        className="group-has-[div]:hidden flex shrink-0 justify-center items-center size-20 border-2 border-dotted border-gray-300 text-gray-400 cursor-pointer rounded-full hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-700/50"
      >
        {form.previewUrl ? (
          <img
            className="w-full object-cover rounded-full"
            src={form.previewUrl}
            alt="Preview"
          />
        ) : (
          <svg
            className="shrink-0 size-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
        )}
      </label>
        </div>

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="grow">
          <div className="flex items-center gap-x-2">
            <label
              htmlFor="profile-upload"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              Upload photo
            </label>
            {form.previewUrl && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, photo: null, previewUrl: null }))}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-500 shadow-2xs hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
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
