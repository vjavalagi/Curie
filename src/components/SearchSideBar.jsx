import React, { useMemo, useState, useEffect, useRef } from "react";
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeSections } from "../backend/SummarizeSections";

export default function SearchSideBar({ selectedFilter, yearRange, researchPapers, loading }) {
  const { setActivePaper, setActiveSummary, activePaper } = useGlobal(); // Assuming activePaper is in GlobalContext
  const [loadingSummary, setLoadingSummary] = useState(false); // Track if the summary is being loaded
  const currentPaperRef = useRef(null); // Ref to store the currently selected paper

  // Reload page and clear local storage
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handlePaperClick = async (paper) => {
    try {
      setActivePaper(paper);
      // If there's a summary loading and a new paper is clicked, clear the previous summary
      if (loadingSummary) {
        setActiveSummary(undefined);
      }
      setLoadingSummary(true); // Indicate that the summary is loading

      // Store the current paper in the ref
      currentPaperRef.current = paper;

      // Check if summary already exists in local storage
      const storedSummary = localStorage.getItem(`summary_${paper.title}`);
      if (storedSummary) {
        // Only set the summary if this paper is still the one clicked
        if (currentPaperRef.current === paper) {
          setActiveSummary(JSON.parse(storedSummary)); // Display from local storage
        }
        setLoadingSummary(false); // Done loading
      } else {
        await PDFDownload(paper);
        const sumresp = await SummarizeSections(paper.title);

        // Only set the summary if this paper is still the one clicked
        if (currentPaperRef.current === paper) {
          setActiveSummary(sumresp);
        }

        // Store the summary in local storage
        localStorage.setItem(`summary_${paper.title}`, JSON.stringify(sumresp));
        setLoadingSummary(false); // Done loading
      }
    } catch (error) {
      setActiveSummary(null);
      setLoadingSummary(false); // Done loading even if error occurs
    }
  };

  const filteredPapers = useMemo(() => {
    return researchPapers.filter((paper) => {
      const publishedYear = new Date(paper.published).getFullYear();
      return (
        (selectedFilter === "All" || paper.publicationTypes?.includes(selectedFilter)) &&
        publishedYear >= yearRange[0] &&
        publishedYear <= yearRange[1]
      );
    });
  }, [researchPapers, selectedFilter, yearRange]);

  return (
    <aside className="flex w-1/4 h-screen overflow-hidden bg-white border-r shadow-md">
      <div className="p-4 overflow-y-auto">
        <h2 className="mb-3 text-xl font-semibold">Research Papers</h2>
        {loading ? (
          <p>Loading research papers...</p>
        ) : filteredPapers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No papers found for {selectedFilter}.
          </p>
        ) : (
          filteredPapers.map((paper) => (
            <button
              key={paper.paperId || paper.title}
              className="w-full p-4 mb-2 text-left border rounded-lg bg-gray-50 hover:bg-gray-200"
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