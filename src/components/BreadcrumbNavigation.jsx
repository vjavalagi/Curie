import React from "react";

export default function BreadcrumbNavigation({ path, onNavigate }) {
  return (
    <div className="w-full max-w-4xl px-4 pt-4">
      <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
        <nav className="flex items-center text-gray-500 text-sm">
          <button
            className="hover:text-blue-600 focus:outline-none focus:text-blue-600"
            onClick={() => onNavigate([])}
          >
            Home
          </button>

          {path.map((folder, index) => (
            <span key={index} className="flex items-center">
              <span className="mx-2">›</span>
              <button
                className={`hover:text-blue-600 focus:outline-none focus:text-blue-600 ${
                  index === path.length - 1 ? "font-semibold text-gray-800" : ""
                }`}
                onClick={() => onNavigate(path.slice(0, index + 1))}
              >
                {folder}
              </button>
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}