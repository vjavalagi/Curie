import React, { useState } from "react";

export default function DirectoryDropdown({ tags = [], onAddTag, onRemoveTag, onClickTag, activeFilters = [] }) {
  const [showInput, setShowInput] = useState(false);
  const [tagName, setTagName] = useState("");

  const handleAdd = () => {
    if (tagName.trim()) {
      onAddTag(tagName.trim());
      setTagName("");
      setShowInput(false);
    }
  };

  return (
    <div className="w-48 h-screen bg-gray-100 border-r border-gray-300 p-1.5 flex flex-col rounded-lg gap-y-2 overflow-y-auto">
      {!showInput ? (
        <button
          type="button"
          className="text-white w-3/4 bg-curieBlue rounded-xl text-base px-6 py-3 mt-2 mb-1 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:ring-2 hover:ring-blue-300/60"
          onClick={() => setShowInput(true)}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="font-semibold">New</p>
          </div>
        </button>
      ) : (
        <div className="px-2 mt-2 flex flex-col gap-2">
          <input
            type="text"
            className="w-full px-2 py-1 text-sm rounded-lg border border-gray-300"
            placeholder="Enter tag name"
            value={tagName}
            autoFocus
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-curieBlue text-white py-1 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => {
                setTagName("");
                setShowInput(false);
              }}
              className="flex-1 border border-gray-300 text-sm rounded-lg py-1 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {tags.map((tag, idx) => (
        <div
          key={idx}
          className={`relative py-3 px-4 pr-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-full bg-white border border-gray-150 shadow-2xs cursor-pointer ${
            activeFilters.includes(tag.name) ? "ring-2 ring-curieBlue" : ""
          }`}
          onClick={() => onClickTag(tag.name)}
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
            onClick={(e) => {
              e.stopPropagation(); // so clicking "X" doesn't trigger filter toggle
              onRemoveTag(tag.name);
            }}
            className="absolute right-3 text-gray-500 hover:text-red-500 text-xs"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
