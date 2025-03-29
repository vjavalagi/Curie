import React, { useState, useEffect, useRef } from "react";
import Tag from "./Tag";

export default function Card({
  tags = [],
  availableTags = [],
  onAssignTag,
  onRemoveTagFromCard,
  onClickTag,
  activeFilters = [],
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative">
      <div className="relative flex flex-col h-full bg-white border border-gray-200 group w-80 shadow-2xs rounded-xl">
        <div className="absolute z-10 top-2 right-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
            className="flex items-center justify-center text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg size-9 shadow-2xs hover:bg-gray-50 focus:outline-none cursor-pointer transform transition-transform duration-200 hover:scale-105"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            aria-label="Dropdown"
          >
            <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-md z-20">
              <div className="p-1 space-y-0.5">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg">
                    <span className="flex items-center gap-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add tags
                    </span>
                  </summary>
                  <div className="ml-4 mt-1 space-y-1">
                  {availableTags.map((tag, idx) => {
                    const alreadyAdded = tags.some((t) => t.name === tag.name);
                    return (
                        <button
                        key={idx}
                        onClick={() => !alreadyAdded && onAssignTag(tag)}
                        className={`text-sm text-left px-2 py-1 w-full rounded flex items-center gap-2 ${
                            alreadyAdded
                            ? "text-gray-400 cursor-not-allowed opacity-60"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        disabled={alreadyAdded}
                        >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                        {alreadyAdded && <span className="text-xs ml-auto">(Added)</span>}
                        </button>
                    );
                    })}
                  </div>
                </details>

                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none" href="#">
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Remove paper
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
          {/* SVG/Logo here */}
        </div>

        <div className="p-4 md:p-6">
          <div className="inline-flex flex-wrap gap-2 mb-1.5">
            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-curieBlue text-curieLightBlue rounded-full">
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Date
            </span>

            {tags.map((tag, idx) => {
              const isActive = activeFilters.includes(tag.name);
              return (
                <span
                  key={idx}
                  onClick={() => onClickTag(tag.name)}
                  className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full text-white cursor-pointer ${
                    isActive ? "ring-2 ring-offset-1 ring-curieBlue" : ""
                  }`}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTagFromCard(tag.name);
                    }}
                    className="ml-1 text-white hover:text-red-200 text-xs"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>

          <h3 className="text-xl font-semibold text-gray-800">Paper Title</h3>

          <div className="inline-flex flex-wrap gap-2 mb-1.5 mt-1.5">
                <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-curieLightGray text-Black rounded-full cursor-pointer transform transition-transform duration-200 hover:scale-105">
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Author
                </span>
                {/* Dynamic for number of Paper Authors */}
                <span className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-curieLightGray text-Black rounded-full cursor-pointer transform transition-transform duration-200 hover:scale-105">
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Author 2
                </span>
            </div>
            <div className="h-20 overflow-hidden text-sm text-gray-600">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, mi et ultricies tincidunt, ligula velit lacinia libero, et porttitor justo nisi vel orci.
                </p>
            </div>        
        </div>
        <div className="px-6 pb-1 text-xs text-gray-500">Last updated by you at 12:00 PM</div>
      </div>
    </div>
  );
}
