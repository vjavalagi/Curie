import React, { useState } from "react";
import SearchFilterSidebar from "./SearchFilterSidebar";

export default function Sidebar() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const researchPapers = [
    { title: "Research Paper 1", category: "Security" },
    { title: "Research Paper 2", category: "AI" },
    { title: "Research Paper 3", category: "Cloud" },
    { title: "Research Paper 4", category: "Blockchain" },
    { title: "Research Paper 5", category: "Security" },
    { title: "Research Paper 6", category: "AI" },
  ];

  // Filter papers based on the selected category
  const filteredPapers =
    selectedFilter === "All"
      ? researchPapers
      : researchPapers.filter((paper) => paper.category === selectedFilter);

  return (
    <aside className="flex h-screen w-2/5 t-12 bg-white border-r shadow-md overflow-hidden">
      {/* Left Filter Sidebar */}
      <SearchFilterSidebar onFilterSelect={setSelectedFilter} />

      {/* Research Paper List */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Research Papers</h2>

        {filteredPapers.length === 0 ? (
          <p className="text-gray-500 text-sm">No papers found for "{selectedFilter}".</p>
        ) : (
          filteredPapers.map((paper, index) => (
            <button
              key={index}
              className="w-full p-4 bg-gray-50 hover:bg-gray-200 rounded-lg text-left mb-2"
            >
              <span className="font-semibold">{paper.title}</span>
              <p className="text-sm text-gray-500">Random Fact</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
