import { useGlobal } from "../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar({ variant = "lightgray" }) {
  const { setSearch } = useGlobal();
  const [tempSearch, setTempSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const bgColor = variant === "lightblue" ? "bg-curieLightBlue" : "bg-curieLightGray";
  const textColor = variant === "lightblue" ? "text-curieBlue" : "text-curieBlue";

  const handleSearch = (searchQuery) => {
    console.log("Search landing clicked");
    setSearch(searchQuery);
    if (location.pathname !== "/search") {
      navigate(`/search`);
    }
    setTempSearch("");
    setSuggestions([]); // Clear suggestions after search
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `https://api.addsearch.com/v1/suggest/1bed1ffde465fddba2a53ad3ce69e6c2?term=${tempSearch}`
        );
        // Extract the array from the returned object
        setSuggestions(response.data.suggestions);
        console.log("Suggestions:", response.data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    if (tempSearch) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [tempSearch]);

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`flex items-center rounded-full px-4 py-2 focus-within:ring-2 bg-white focus-within:ring-curieBlue ${bgColor}`}
      >
        <input
          type="text"
          className={`flex-1 bg-white outline-none text-md ${bgColor} ${textColor}`}
          placeholder="Search Curie..."
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(tempSearch);
            }
          }}
        />
        <button
          onClick={() => handleSearch(tempSearch)}
          className="bg-curieBlue hover:bg-blue-600 text-curieLightGray font-semibold py-1 px-6 rounded-full"
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

      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSearch(suggestion.value)}
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
