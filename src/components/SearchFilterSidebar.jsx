import React, { useState } from "react";

export default function SearchFilterSidebar({ onFilterSelect }) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? "w-1/6" : "w-0"
      } border-r bg-gray-100 rounded-lg overflow-hidden`}
    >
      <div
        className={`h-full bg-white border-e border-gray-200 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <div className="flex-none font-semibold text-xl text-black select-none">
              Brand
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              className="flex justify-center items-center gap-x-3 size-8 text-sm text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:bg-gray-100"
            >
              {isOpen ? (
                // Collapse Icon
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
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
                // Expand Icon
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
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
          </header>
          {/* End Header */}

          {/* Body */}
          <nav className="h-full overflow-y-auto">
            <ul className="space-y-1 p-2">
              <li>
                <button className="flex items-center w-full gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button className="flex items-center w-full gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  </svg>
                  Users
                </button>
              </li>
              <li>
                <button className="flex items-center w-full gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="15" r="3" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  Account
                </button>
              </li>
              <li>
                <button className="flex items-center w-full gap-x-3 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg
                    className="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
                    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
                  </svg>
                  Projects
                </button>
              </li>
            </ul>
          </nav>
          {/* End Body */}
        </div>
      </div>
    </div>
  );
}
