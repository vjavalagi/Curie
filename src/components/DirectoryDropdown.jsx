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
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-300 p-1.5 flex flex-col rounded-lg gap-y-2 overflow-y-auto">
      {!showInput ? (
  <button
    type="button"
    className="inline-flex w-full items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-curieBlue text-white py-2.5 px-4 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition"
    onClick={() => setShowInput(true)}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <span>New Tag</span>
  </button>
) : (
  <div className="px-2 mt-2 flex flex-col gap-2">
    <input
      type="text"
      className="py-2 px-3 block w-full border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter tag name"
      value={tagName}
      autoFocus
      onChange={(e) => setTagName(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
    />
    <div className="flex gap-2">
      <button
        onClick={handleAdd}
        className="w-full inline-flex justify-center items-center gap-x-2 rounded-md border border-transparent bg-curieBlue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition"
      >
        Add
      </button>
      <button
        onClick={() => {
          setTagName("");
          setShowInput(false);
        }}
        className="w-full inline-flex justify-center items-center gap-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      
      <div className="inline-flex flex-wrap gap-2 mb-1.5 pt-1 pl-1">
      {tags.map((tag, idx) => (
        <div
          key={idx}
          className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-sm font-medium rounded-full text-white cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
            activeFilters.includes(tag.name) ? "ring-2 ring-curieBlue" : ""
          }`}
          onClick={() => onClickTag(tag.name)}
          style={{
            backgroundColor: tag.color,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag-icon lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
          <span className="font-semibold">{tag.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // so clicking "X" doesn't trigger filter toggle
              onRemoveTag(tag.name);
            }}
            className="ml-1 text-white hover:text-red-200 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}