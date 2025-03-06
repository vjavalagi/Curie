import React, { useState } from "react";

export default function SearchFilterSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ${
          isOpen ? "w-64" : "w-8"
        } h-screen bg-white border-r`}
      >
        {/* Sidebar content */}
        {isOpen && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            {/* Navigation, etc. */}
          </div>
        )}
      </div>

      {/* Floating button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-3.5 -right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white border shadow hover:shadow-md"
      >
        {isOpen ? (
          // Collapse icon
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m10 15-3-3 3-3" />
          </svg>
        ) : (
          // Expand icon
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m8 9 3 3-3 3" />
          </svg>
        )}
      </button>
    </div>
  );
}
