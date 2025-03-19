import React, { useState, useEffect } from "react";
import { searchAPI } from "../backend/Search"; // adjust the import path as needed
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeSections } from "../backend/SummarizeSections";

export default function Sidebar({ selectedFilter, yearRange }) {
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { search, setSearch, setActivePaper, setActiveSummary } = useGlobal();

  useEffect(() => {
    setLoading(true);
    searchAPI({
      topic: search,
      limit: 40,
    })
      .then((data) => {
        setResearchPapers(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch research papers:", err);
        setError(err);
        setLoading(false);
      });
  }, [search]);

  const handlePaperClick = async (paper) => {
    try {
      console.log("Updating Paper", paper);
      setActivePaper(paper);
      // Set to undefined to indicate summary is loading
      setActiveSummary(undefined);
      console.log("Downloading PDF for paper:", paper.title);
      await PDFDownload(paper);
      console.log("PDF download complete. Proceeding to summarize sections.");
      
      const sumresp = await SummarizeSections(paper.title);
      // If sumresp is falsy, it will be treated as "no summary available"
      setActiveSummary(sumresp);
      console.log("Summary complete", sumresp);
    } catch (error) {
      console.error("Error handling paper click:", error);
      // On error, set the summary to null so that the UI can show a fallback message
      setActiveSummary(null);
    }
  };

  // Filter papers based on the selected category and year range.
  const filteredPapers = researchPapers.filter((paper) => {
    const publishedYear = new Date(paper.published).getFullYear();
    return (
      (selectedFilter === "All" || paper.publicationTypes?.includes(selectedFilter)) &&
      publishedYear >= yearRange[0] &&
      publishedYear <= yearRange[1]
    );
  });

  return (
    <aside className="flex h-screen w-1/4 bg-white border-r shadow-md overflow-hidden">
      <div className="p-4 overflow-y-auto">
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
              <p className="text-sm text-gray-500">{paper.authors.join(", ")}</p>
              <p className="text-sm text-gray-500">{paper.published}</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}