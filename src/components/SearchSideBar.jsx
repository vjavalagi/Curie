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
  
      const cacheKey = `summary_${paper.title}`;
      const cachedSummaryData = localStorage.getItem(cacheKey);
  
      if (cachedSummaryData) {
        const parsedSummary = JSON.parse(cachedSummaryData);
        const currentLength = Number(localStorage.getItem("current_summary_length") || 4);
  
        const summaryContent = {
          title: parsedSummary.title,
          introduction: parsedSummary.introduction,
          content: parsedSummary.content.map((item) => ({
            section: item.section,
            summary:
              currentLength === 2
                ? item.two_entence_summary
                : currentLength === 4
                ? item.four_sentence_summary
                : item.six_sentence_summary,
          })),
          conclusion: parsedSummary.conclusion,
        };
  
        setActiveSummary(summaryContent);
        setLoadingSummary(false);
        return;
      }
  
      // Download and summarize
      await PDFDownload(paper);
      const summaryData = await SummarizeSectionsSent(paper.title);
  
      // Store full object with all three lengths
      localStorage.setItem(cacheKey, JSON.stringify(summaryData));
  
      // Build active summary based on length
      const currentLength = Number(localStorage.getItem("current_summary_length") || 4);
      const summaryContent = {
        title: summaryData.title,
        introduction: summaryData.introduction,
        content: summaryData.content.map((item) => ({
          section: item.section,
          summary:
            currentLength === 2
              ? item.two_entence_summary
              : currentLength === 4
              ? item.four_sentence_summary
              : item.six_sentence_summary,
        })),
        conclusion: summaryData.conclusion,
      };
  
      if (currentPaperRef.current === paper) {
        setActiveSummary(summaryContent);
        setLoadingSummary(false);
      }
    } catch (error) {
      console.error("Error loading summary:", error);
      if (currentPaperRef.current === paper) {
        setActiveSummary(undefined);
        setLoadingSummary(false);
      }
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