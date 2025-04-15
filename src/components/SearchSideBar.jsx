import React, { useMemo, useState, useEffect, useRef } from "react";
import { useGlobal } from "../context/GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeSections } from "../backend/SummarizeSections";
import { SummarizeSectionsSent } from "../backend/SummarizeSectionsSent";

export default function SearchSideBar({ selectedFilter, yearRange, researchPapers, loading }) {
  const { setActivePaper, setActiveSummary, activePaper } = useGlobal(); // Assuming activePaper is in GlobalContext
  const [loadingSummary, setLoadingSummary] = useState(false); // Track if the summary is being loaded
  const currentPaperRef = useRef(null); // Ref to store the currently selected paper


  const handlePaperClick = async (paper) => {
    try {
      setActivePaper(paper);
      setActiveSummary(undefined); // Clear previous summary
      setLoadingSummary(true);
      currentPaperRef.current = paper;
  
      // Check if summaries 2, 4, and 6 are already in localStorage
      const summariesInCache = {
        2: localStorage.getItem(`summary_2_${paper.title}`),
        4: localStorage.getItem(`summary_4_${paper.title}`),
        6: localStorage.getItem(`summary_6_${paper.title}`),
      };
  
      // If all summaries exist in cache, load summary based on current_summary_length
      if (summariesInCache[2] && summariesInCache[4] && summariesInCache[6]) {
        // get the current summary length from localStorage or default to 4
        const currentSummaryLength = Number(localStorage.getItem("current_summary_length") || 4);
        const summaryKey = `summary_${currentSummaryLength}_${paper.title}`;
        const summary = localStorage.getItem(summaryKey);
        setActiveSummary(JSON.parse(summary));
        setLoadingSummary(false);
        return;
      }
  
      // Fetch and store summary of length 2 if not cached
      if (!summariesInCache[2]) {
        await PDFDownload(paper); // Assuming this is needed for each request
        const summary2 = await SummarizeSectionsSent(paper.title, 2);
        localStorage.setItem(`summary_2_${paper.title}`, JSON.stringify(summary2));
      }
  
      // Fetch and store summary of length 4 if not cached
      if (!summariesInCache[4]) {
        const summary4 = await SummarizeSectionsSent(paper.title, 4);
        localStorage.setItem(`summary_4_${paper.title}`, JSON.stringify(summary4));
      }
  
      // Fetch and store summary of length 6 if not cached
      if (!summariesInCache[6]) {
        const summary6 = await SummarizeSectionsSent(paper.title, 6);
        localStorage.setItem(`summary_6_${paper.title}`, JSON.stringify(summary6));
      }
  
      // After all summaries are fetched, set the active summary
      const currentSummaryLength = Number(localStorage.getItem("current_summary_length") || 4);
      const summaryKey = `summary_${currentSummaryLength}_${paper.title}`;
      const finalSummary= localStorage.getItem(summaryKey);
    
      //const finalSummary = JSON.parse(localStorage.getItem(`summary_4_${paper.title}`));
      setActiveSummary(finalSummary);
  
      setLoadingSummary(false);
    } catch (error) {
      console.error("Error loading summaries:", error);
      setActiveSummary(undefined);
      setLoadingSummary(false);
    }
  };
  
  

  const filteredPapers = useMemo(() => {
    return researchPapers.filter((paper) => {
      const publishedYear = new Date(paper.published).getFullYear();
      return (
        (selectedFilter === "All" ||
          paper.publicationTypes?.includes(selectedFilter)) &&
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
              <p className="text-sm text-gray-500">
                {paper.authors.join(", ")}
              </p>
              <p className="text-sm text-gray-500">{paper.published}</p>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}