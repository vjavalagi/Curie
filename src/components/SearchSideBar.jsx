import React, { useState, useEffect } from "react";
import SearchFilterSidebar from "./SearchFilterSidebar";
import { searchAPI } from "../backend/Search"; // adjust the import path as needed
import { useGlobal } from "./GlobalContext";
import { stringify } from "postcss";
export default function Sidebar() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {search, setSearch, setActivePaper} = useGlobal();
  // when page first render set the search query
  useEffect(() => {
    setLoading(true);
    console.log(search);
    searchAPI({
      query: search,
      year: "2005-",
      onlyOpenAccess: false,
      fields: "title,url,citationCount,publicationTypes,publicationDate",
    })
      .then((data) => {
        setResearchPapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch research papers:", err);
        setError(err);
        setLoading(false);
      });
  }, [search]);

  const handlePaperClick = (paper) => {
    console.log("Updating Paper");
    setActivePaper(paper)
    console.log(paper);

  }

  // Filter papers based on the selected category.
  // Here we assume that the "publicationTypes" property is an array.
  const filteredPapers =
    selectedFilter === "All"
      ? researchPapers
      : researchPapers.filter((paper) =>
          paper.publicationTypes?.includes(selectedFilter)
        );

  return (
    <aside className="flex h-screen w-2/5 bg-white border-r shadow-md overflow-hidden">
      {/* Left Filter Sidebar */}
      <SearchFilterSidebar onFilterSelect={setSelectedFilter} />

      {/* Research Paper List */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Research Papers</h2>

        {loading ? (
          <p>Loading research papers...</p>
        ) : error ? (
          <p className="text-red-500">Error loading papers: {error.message}</p>
        ) : filteredPapers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No papers found for {selectedFilter}.
          </p>
        ) : (
          filteredPapers.map((paper) => (
            <button
              key={paper.paperId || paper.title}
              className="w-full p-4 bg-gray-50 border hover:bg-gray-200 rounded-lg text-left mb-2"
              onClick={() => handlePaperClick(paper)}
            
            >
              <span className="font-semibold">{paper.title}</span>
              <p className="text-sm text-gray-500">{paper.publicationDate}</p>
              <p className="text-sm text-gray-500">{"Cited: " + paper.citationCount}</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
