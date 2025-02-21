import React, { useState } from "react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/solid";

export default function DirectoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-48 bg-gray-100 h-screen border-r border-gray-300 rounded-lg p-2 relative">
      {/* Dropdown Header */}
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Current Directory</span>
        <ChevronDownIcon className="w-5 h-5" />
      </button>

      {/* Dropdown Menu (if open) */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Folder 1</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Folder 2</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Folder 3</li>
          </ul>
        </div>
      )}

      {/* Filter Button (Preline UI-style) */}
      <button className="flex items-center gap-2 mt-2 w-full px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
        <FunnelIcon className="w-4 h-4" />
        Filters
      </button>
    </div>
  );
}
