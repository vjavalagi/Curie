import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function DirectoryDropdown({ currentDirectory, folders, onSelect }) {

  return (
    <div className="w-48 h-screen bg-gray-100 border-r border-gray-300 p-1.5 flex flex-col rounded-lg gap-y-2">
      <button type="button" className="text-white bg-gradient-to-br w-3/4 from-curieBlue to-blue-500 hover:bg-gradient-to-bl rounded-xl text-base px-6 py-3 mt-2 mb-1">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <p className="font-semibold">New</p>
        </div>
      </button>
      
      <button type="button" className="relative py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-gray-150 border border-gray-150 text-gray-800 shadow-2xs hover:bg-gray-200 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
        
        
        <span className="font-semibold">Tag 1</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#1a2d8d" //This is the fill color of the icon
          className="w-4 h-4 absolute -top-0 right-6 drop-shadow-md"
          style={{ transform: "scaleY(1.5)" }}
        >
          <path
            fillRule="evenodd"
            d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      <button type="button" className="relative py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-gray-150 border border-gray-150 text-gray-800 shadow-2xs hover:bg-gray-200 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
        <span className="font-semibold">Tag 2</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#cbf8fc"
          className="w-4 h-4 absolute -top-0 right-6 drop-shadow-md"
          style={{ transform: "scaleY(1.5)" }}
        >
          <path
            fillRule="evenodd"
            d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

    </div>

    
  );
}