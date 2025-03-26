import React from "react";

export default function DirectoryDropdown({ tags = [], onAddTag, onRemoveTag }) {
  return (
    <div className="w-48 h-screen bg-gray-100 border-r border-gray-300 p-1.5 flex flex-col rounded-lg gap-y-2 overflow-y-auto">
      <button
        type="button"
        className="text-white w-3/4 bg-curieBlue rounded-xl text-base px-6 py-3 mt-2 mb-1 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:ring-2 hover:ring-blue-300/60"
        onClick={onAddTag}
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <p className="font-semibold">New</p>
        </div>
      </button>

      {tags.map((tag, idx) => (
        <div
          key={idx}
          className="relative py-3 px-4 pr-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-white border border-gray-150 text-gray-800 shadow-2xs"
        >
          <span className="font-semibold">{tag.name}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={tag.color}
            className="w-4 h-4 absolute -top-0 right-8 drop-shadow-md"
            style={{ transform: "scaleY(1.5)" }}
          >
            <path
              fillRule="evenodd"
              d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
              clipRule="evenodd"
            />
          </svg>
          <button
            onClick={() => onRemoveTag(tag.name)}
            className="absolute right-3 text-gray-500 hover:text-red-500 text-xs"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
