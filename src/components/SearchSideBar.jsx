import React, { useState, useEffect } from "react";
import { searchAPI } from "../backend/Search"; 
import { useGlobal } from "./GlobalContext";

export default function Sidebar() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { search, setSearch, setActivePaper } = useGlobal();

  useEffect(() => {
    setLoading(true);
    searchAPI({
      query: search,
      max_results: 40, 
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
    console.log("Updating Paper to : ", paper.title);
    setActivePaper(paper);
  };

  return (
    <aside className="flex h-screen w-1/4 bg-white border-r shadow-md overflow-hidden">
      <div className="p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Research Papers</h2>
        {loading ? (
          <p>Loading research papers...</p>
        ) : error ? (
          <p className="text-red-500">Error loading papers: {error.message}</p>
        ) : researchPapers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No papers found for {search}.
          </p>
        ) : (
          researchPapers.map((paper) => (
            <button
              key={paper.arxiv_id || paper.title}
              className="w-full p-4 bg-gray-50 border hover:bg-gray-200 rounded-lg text-left mb-2"
              onClick={() => handlePaperClick(paper)}
            >
              <span className="font-semibold">{paper.title}</span>
              <p className="text-sm text-gray-500">{paper.published}</p>
              <p className="text-sm text-gray-500">
                Authors: {paper.authors.join(", ")}
              </p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
