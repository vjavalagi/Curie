import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { PublicationDateSlider} from "./PublicationDateSlider"; // adjust path as needed

export default function SearchFilterSidebar({ minYear, maxYear, onYearRangeChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [values, setValues] = useState([minYear, maxYear]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    setValues([minYear, maxYear]);
    if (window.HSStaticMethods && window.HSStaticMethods.autoInit) {
      window.HSStaticMethods.autoInit();
    }
  }, [minYear, maxYear]);

  const handleRangeChange = (values) => {
    setValues(values);
    onYearRangeChange(values);
  };

  // // Sentence Count State
  // const [sentenceCount, setSentenceCount] = useState(() => {
  //   const stored = localStorage.getItem("sentenceCount");
  //   return stored ? JSON.parse(stored) : [2, 6];
  // });

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
            <h2 className="mb-3 text-xl font-semibold">Filters</h2>
            {/* Navigation, etc. */}
            <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
              <div
                className="flex flex-col flex-wrap pb-0 hs-accordion-group"
                data-hs-accordion-always-open
              >
            <ul className="space-y-1 height-full">
            <PublicationDateSlider
              values={values}
              minYear={minYear}
              maxYear={maxYear}
              onChange={handleRangeChange}
            />                  
            </ul>
                
      </div>
      </nav>
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

