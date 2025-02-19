import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full max-w-xl flex items-center border border-gray-300 rounded-full px-5 py-3 shadow-md focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        className="flex-1 outline-none text-lg"
        placeholder="Search Curie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button class="bg-blue-900 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </div>
  );
}
