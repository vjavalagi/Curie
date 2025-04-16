import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

export function PublicationDateSlider({ minYear, maxYear, onYearRangeChange }) {
  const [values, setValues] = useState([minYear, maxYear]);
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

  useEffect(() => {
    // Ensure accordion JS initializes
    if (window.HSStaticMethods && window.HSStaticMethods.autoInit) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  return (
    <div className="hs-accordion" id="account-accordion">
      <button
        type="button"
        className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
        aria-expanded="true"
        aria-controls="account-accordion-sub-1-collapse-1"
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
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
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
        <svg
          className="block text-gray-600 hs-accordion-active:hidden ms-auto size-4 group-hover:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          viewBox="0 0 24 24"
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
            onYearRangeChange={onYearRangeChange}
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
                    colors: ["#E5E7EB", "#1a2d8d", "#E5E7EB"],
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
                  backgroundColor: "#1a2d8d",
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
    </div>
  );
}
