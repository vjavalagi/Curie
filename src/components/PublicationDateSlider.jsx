import React, { useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

export function PublicationDateSlider({ values, minYear, maxYear, onChange }) {
  useEffect(() => {
    if (window.HSStaticMethods?.autoInit) {
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
        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="18" cy="15" r="3" />
          <circle cx="9" cy="7" r="4" />
          <path d="M10 15H6a4 4 0 0 0-4 4v2" />
          {/* ... other paths ... */}
        </svg>
        Publication Date
        <svg className="hidden text-gray-600 hs-accordion-active:block ms-auto size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m18 15-6-6-6 6" />
        </svg>
        <svg className="block text-gray-600 hs-accordion-active:hidden ms-auto size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
            onChange={onChange}
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
                  border: "2px solid white",
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
