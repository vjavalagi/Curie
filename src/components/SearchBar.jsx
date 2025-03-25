import { useGlobal } from "./GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SearchBar({ variant = "lightgray" }) {
  const {search, setSearch} = useGlobal();
  const navigate = useNavigate();
  const location = useLocation();

  // Load the last search from localStorage or default to an empty string
  const [tempSearch, setTempSearch] = useState(localStorage.getItem("lastSearch") || search);
  
  const bgColor = variant === "lightblue" ? "bg-curieLightBlue" : "bg-curieLightGray";
  const textColor = variant === "lightblue" ? "text-curieBlue" : "text-curieBlue";

  const handleSearch = (searchQuery) => {
    console.log("Search landing clicked");
    setSearch(searchQuery);

    if (location.pathname !== "/search") {
      navigate(`/search`);
    }
    // Optionally, save the search term in localStorage
    localStorage.setItem("lastSearch", searchQuery);
  };

  useEffect(() => {
    setTempSearch(search); // Sync tempSearch when global search changes
  }, [search]);

  return (
    <div className={`w-full max-w-xl flex items-center rounded-full px-4 py-2 focus-within:ring-2 bg-white focus-within:ring-curieBlue ${bgColor}`}>
      <input
        type="text"
        className={`flex-1 bg-white outline-none text-md ${bgColor} ${textColor}`}
        placeholder="Search Curie..."
        value={tempSearch}
        onChange={(e) => setTempSearch(e.target.value)}
        onKeyDown={(e) =>{if (e.key == "Enter"){handleSearch(tempSearch)}} }
      />
      <button
        onClick={() => handleSearch(tempSearch)}
        className="px-6 py-1 font-semibold rounded-full bg-curieBlue hover:bg-blue-600 text-curieLightGray"
      >
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
