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

  useEffect(() => {
    setTempSearch(search);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setTempSearch("");
      setSuggestions([]);
    }
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="max-w-xl w-full relative" data-hs-combo-box='{
      "groupingType": "default",
      "isOpenOnFocus": true
    }'>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <input
          type="text"
          className={`py-2.5 ps-10 pe-4 block w-full rounded-lg border-gray-200 bg-white sm:text-sm focus:border-blue-500 focus:ring-blue-500 ${bgColor} ${textColor}`}
          placeholder="Search Curie..."
          value={tempSearch}
          data-hs-combo-box-input=""
          onChange={(e) => setTempSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(tempSearch);
            }
          }}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md" data-hs-combo-box-output="">
          <div className="max-h-72 overflow-y-auto rounded-b-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {suggestions.map((suggestion, index) => {
              const matchIndex = suggestion.value.toLowerCase().indexOf(tempSearch.toLowerCase());
              const before = suggestion.value.slice(0, matchIndex);
              const match = suggestion.value.slice(matchIndex, matchIndex + tempSearch.length);
              const after = suggestion.value.slice(matchIndex + tempSearch.length);

              return (
                <div
                  key={index}
                  className="flex items-center cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100"
                  data-hs-combo-box-output-item=""
                  onClick={() => {
                    setJustSelected(true);
                    setTempSearch(suggestion.value);
                    handleSearch(suggestion.value);
                  }}
                >
                  <div className="flex items-center w-full">
                    <span>
                      {before}
                      <span className="font-bold text-curieBlue">{match}</span>
                      {after}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
