import { useGlobal } from "../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function SearchBar({ variant = "lightgray" }) {
  const { search, setSearch } = useGlobal();
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef();

  const [tempSearch, setTempSearch] = useState(
    location.pathname === "/search" ? localStorage.getItem("lastSearch") || search : ""
  );
  const [suggestions, setSuggestions] = useState([]);
  const [justSelected, setJustSelected] = useState(false);

  const bgColor = variant === "lightblue" ? "bg-curieLightBlue" : "bg-curieLightGray";
  const textColor = variant === "lightblue" ? "text-curieBlue" : "text-curieBlue";

  const handleSearch = (searchQuery) => {
    setSearch(searchQuery);
    localStorage.setItem("lastSearch", searchQuery);
    setSuggestions([]);
    if (location.pathname !== "/search") {
      navigate(`/search`);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `https://api.addsearch.com/v1/suggest/1bed1ffde465fddba2a53ad3ce69e6c2?term=${tempSearch}`
      );
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    if (tempSearch) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [tempSearch]);

  // Sync tempSearch with global state when search changes
  useEffect(() => {
    setTempSearch(search);
  }, [search]);

  // Clear suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear suggestions when switching away from /search
  useEffect(() => {
    if (location.pathname !== "/search") {
      setTempSearch("");       // Clear the input
      setSuggestions([]);      // Clear the dropdown
    }
  }, [location.pathname]);
  

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className={`flex items-center rounded-full px-4 py-2 focus-within:ring-2 bg-white focus-within:ring-curieBlue ${bgColor}`}>
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
          className="px-6 py-1 font-semibold rounded-full bg-curieBlue hover:bg-blue-600 text-curieLightGray"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-md max-h-60 overflow-y-auto text-left">
          {suggestions.map((suggestion, index) => {
            const matchIndex = suggestion.value.toLowerCase().indexOf(tempSearch.toLowerCase());
            const before = suggestion.value.slice(0, matchIndex);
            const match = suggestion.value.slice(matchIndex, matchIndex + tempSearch.length);
            const after = suggestion.value.slice(matchIndex + tempSearch.length);

            return (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                onClick={() => {
                  setJustSelected(true);
                  setTempSearch(suggestion.value);
                  handleSearch(suggestion.value);
                }}
              >
                {before}
                <span className="font-bold text-curieBlue">{match}</span>
                {after}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
