import { useState } from "react";

export default function SearchBar({ variant = "lightgray" }) {
  const [search, setSearch] = useState("");

  const bgColor = variant === "lightblue" ? "bg-curieLightBlue" : "bg-curieLightGray";
  const textColor = variant === "lightblue" ? "text-curieLightGray" : "text-curieBlue";

  return (
    <div className={`w-full max-w-xl flex items-center border border-curieLightGray rounded-full px-5 py-1 shadow-md focus-within:ring-2 focus-within:ring-curieBlue ${bgColor}`}>
      <input
        type="text"
        className={`flex-1 outline-none text-lg ${bgColor} ${textColor}`}
        placeholder="Search Curie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="bg-curieBlue hover:bg-blue-600 text-curieLightGray font-semibold py-2 px-6 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}