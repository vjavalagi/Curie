import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

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

                  {/* Publication Date Accordion */}
                  <li className="hs-accordion" id="account-accordion">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                      aria-expanded="true"
                      aria-controls="account-accordion-sub-1-collapse-1"
                    >
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
                        <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                        <path d="m21.7 16.4-.9-.3" />
                        <path d="m15.2 13.9-.9-.3" />
                        <path d="m16.6 18.7.3-.9" />
                        <path d="m19.1 12.2.3-.9" />
                        <path d="m19.6 18.7-.4-1" />
                        <path d="m16.8 12.3-.4-1" />
                        <path d="m14.3 16.6 1-.4" />
                        <path d="m20.7 13.8 1-.4" />
                      </svg>
                      Publication Date
                      <svg
                        className="hidden text-gray-600 hs-accordion-active:block ms-auto size-4 group-hover:text-gray-500"
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
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="block text-gray-600 hs-accordion-active:hidden ms-auto size-4 group-hover:text-gray-500"
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
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      id="account-accordion-sub-1-collapse-1"
                      className="hs-accordion-content overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="account-accordion"
                    >
                      <div className="mt-2 ml-4 mr-4">
                        <Range
                          values={values}
                          step={1}
                          min={minYear}
                          max={maxYear}
                          onChange={handleRangeChange}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: "6px",
                                width: "100%",
                                borderRadius: "4px",
                                background: getTrackBackground({
                                  values,
                                  colors: ["#E5E7EB", "#1a2d8d", "#E5E7EB"], // Soft gray & blue theme
                                  min: minYear,
                                  max: maxYear,
                                }),
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                transition: "background 0.3s ease",
                              }}
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: "18px",
                                width: "18px",
                                borderRadius: "50%",
                                backgroundColor: "#1a2d8d", // Blue theme color
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                border: "2px solid white",
                                transition: "transform ease-in-out",
                              }}
                            />
                          )}
                        />
                        <div className="flex justify-between mt-2">
                          <span>{values[0]}</span>
                          <span>{values[1]}</span>
                        </div>
                      </div>
                    </div>
                  </li>


                  {/* Sentence Count Accordion front-end added if we want it
                  <li className="hs-accordion" id="sentence-count-accordion">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                      aria-expanded="true"
                      aria-controls="sentence-count-accordion-collapse"
                    >
                      <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M4 4h16M4 8h10M4 12h16M4 16h10M4 20h16" />
                      </svg>
                      Sentence Count
                      <svg className="hidden text-gray-600 hs-accordion-active:block ms-auto size-4 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg className="block text-gray-600 hs-accordion-active:hidden ms-auto size-4 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      id="sentence-count-accordion-collapse"
                      className="hs-accordion-content overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="sentence-count-accordion"
                    >
                      <div className="mt-2 ml-4 mr-4">
                        <Range
                          values={sentenceCount}
                          step={1}
                          min={2}
                          max={6}
                          onChange={(values) => setSentenceCount(values)}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: "6px",
                                width: "100%",
                                borderRadius: "4px",
                                background: getTrackBackground({
                                  values: sentenceCount,
                                  colors: ["#E5E7EB", "#1a2d8d", "#E5E7EB"],
                                  min: 2,
                                  max: 6,
                                }),
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                transition: "background 0.3s ease",
                              }}
                            >
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: "18px",
                                width: "18px",
                                borderRadius: "50%",
                                backgroundColor: "#1a2d8d",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                border: "2px solid white",
                                transition: "transform ease-in-out",
                              }}
                            />
                          )}
                        />
                        <div className="flex justify-between mt-2">
                          <span>{sentenceCount[0]}</span>
                          <span>{sentenceCount[1]}</span>
                        </div>
                      </div>
                    </div>
                  </li> */}


                  {/* Conference! */}
                  <li className="hs-accordion" id="projects-accordion">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                      aria-expanded="true"
                      aria-controls="projects-accordion-sub-1-collapse-1"
                    >
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
                        <path d="M15 2v5h5" />
                      </svg>
                      Conference
                      <svg
                        className="hidden text-gray-600 hs-accordion-active:block ms-auto size-4 group-hover:text-gray-500"
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
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="block text-gray-600 hs-accordion-active:hidden ms-auto size-4 group-hover:text-gray-500"
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
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      id="projects-accordion-sub-1-collapse-1"
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="projects-accordion"
                    >
                    {/* Placeholder comment for projects dropdown */}
                    </div>
                  </li>

      
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

