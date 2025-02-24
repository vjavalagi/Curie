import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function DirectoryDropdown({ currentDirectory, folders, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-48 h-screen bg-gray-100 border-r border-gray-300 p-4 flex flex-col rounded-lg">
      <button
        className="flex items-center justify-between w-full text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentDirectory || "Home"}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-2" : "max-h-0"}`}>
        <ul className="space-y-2">
          {folders.length > 0 ? (
            folders.map((folder, index) => (
              <li 
                key={index} 
                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 animate-fade-in"
                onClick={() => onSelect(folder)}
              >
                {folder}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No Folders Available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
