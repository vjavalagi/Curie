import { useState } from "react";
import curieLogo from "../assets/curie_no_background.png"; // Import the image


export default function LandingPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <img src={curieLogo} alt="Curie Logo" className="w-48 mb-8" />

      {/* Search Bar */}
      <div className="w-full max-w-xl flex items-center border border-gray-300 rounded-full px-5 py-3 shadow-md focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          className="flex-1 outline-none text-lg"
          placeholder="Search Curie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          Search
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        <a href="#" className="hover:underline px-2">Privacy</a> | 
        <a href="#" className="hover:underline px-2">Terms</a>
      </footer>
    </div>
  );
}
