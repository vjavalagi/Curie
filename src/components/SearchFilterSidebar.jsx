import React, { useState } from "react";

export default function SearchFilterSidebar({ onFilterSelect }) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Security", "AI", "Cloud", "Blockchain"];

  return (
    <div className="w-1/3 border-r p-4 bg-gray-100">
      <h3 className="font-bold text-lg mb-3">Filter</h3>
      <ul className="space-y-2">
        {filters.map((filter, index) => (
          <li key={index}>
            <button
              onClick={() => {
                setSelectedFilter(filter);
                if (onFilterSelect) onFilterSelect(filter); // Pass filter selection up
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                selectedFilter === filter
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
