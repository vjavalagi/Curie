import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-md overflow-y-auto pt-16">
      <div className="p-4 text-xl font-semibold flex items-center justify-between">
        <span>Curie</span>
        <button className="text-gray-500 hover:text-gray-700">Filter</button>
      </div>

      {/* Example Research Paper List */}
      <div className="space-y-2 p-2">
        {Array.from({ length: 6 }, (_, i) => (
          <button
            key={i}
            className="w-full p-4 bg-gray-50 hover:bg-gray-200 rounded-lg text-left"
          >
            <span className="font-semibold">Research Paper {i + 1}</span>
            <p className="text-sm text-gray-500">Random Fact</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
