import React, { useState, useEffect } from "react";
import { searchAPI } from "../backend/Search"; // adjust the import path as needed
import { useGlobal } from "./GlobalContext";
import { stringify } from "postcss";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeDocument } from "../backend/SummarizeDocument";
import { SummarizeSections } from "../backend/SummarizeSections";

export default function Sidebar() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [researchPapers, setResearchPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {search, setSearch, setActivePaper, setActiveSummary} = useGlobal();
  // when page first render set the search query
  //const { search, setSearch, setActivePaper } = useGlobal();

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
      console.log("Updating Paper");
      setActivePaper(paper);
      setActiveSummary(null);
      console.log("Downloading PDF for paper:", paper.title);
      await PDFDownload(paper); // Wait for PDF download to complete
      console.log("PDF download complete. Proceeding to summarize sections.");
     
      const sumresp = await SummarizeSections(paper.title);
      setActiveSummary(sumresp);
      console.log("Summary complete");
      console.log("activeSummary changed:", sumresp);
    } catch (error) {
      console.error("Error handling paper click:", error);
    }
  };

  // Filter papers based on the selected category.
  // Here we assume that the "publicationTypes" property is an array.
  const filteredPapers =
    selectedFilter === "All"
      ? researchPapers
      : researchPapers.filter((paper) =>
          paper.publicationTypes?.includes(selectedFilter)
        );

  return (
    <aside className="flex h-screen w-1/4 bg-white border-r shadow-md overflow-hidden">
      <div className="p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3"> 	&nbsp;       	&nbsp;Research Papers</h2>
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
