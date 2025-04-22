import React, { useMemo, useState, useEffect, useRef } from "react";
import { useGlobal } from "../context/GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeSectionsSent } from "../backend/SummarizeSectionsSent";
import { PublicationDateSlider } from "./PublicationDateSlider";


export default function SearchSideBar({
  selectedFilter,
  yearRange,
  researchPapers,
  loading,
  minYear,
  maxYear,
  onYearRangeChange,
}) {
  const { setActivePaper, setActiveSummary, activePaper } = useGlobal(); // Assuming activePaper is in GlobalContext
  const [loadingSummary, setLoadingSummary] = useState(false); // Track if the summary is being loaded
  const currentPaperRef = useRef(null); // Ref to store the currently selected paper
  const [values, setValues] = useState([minYear, maxYear]);

  useEffect(() => {
    setValues([minYear, maxYear]);
    if (window.HSStaticMethods && window.HSStaticMethods.autoInit) {
      window.HSStaticMethods.autoInit();
    }
  }, [minYear, maxYear]);

  const handleRangeChange = (values) => {
    setValues(values);
    onYearRangeChange(values);
  };

  const handlePaperClick = async (paper) => {
    try {
      console.log("Paper clicked:", paper);
      setActivePaper(paper);
      setActiveSummary(undefined); // Clear previous summary immediately
      setLoadingSummary(true); // Indicate that the summary is being checked/loaded

      // Store the current paper reference to prevent outdated updates
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
  
      // If not found, proceed to fetch summary
      console.log("Fetching new summary for:", paper);
      const response = await PDFDownload(paper);
      console.log("PDF download response:", response);
      const sumresp = await SummarizeSections(paper.title);
  
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
    <aside className="flex w-1/3 h-screen overflow-hidden bg-white border-r shadow-md">
      <div className="p-4 overflow-y-auto w-full">
        <h2 className="mb-3 text-xl w-full font-semibold">Research Papers</h2>
        <PublicationDateSlider
          values={yearRange}
          minYear={minYear}
          maxYear={maxYear}
          onChange={handleRangeChange}
        />
       
        {loading ? (
          <p className="w-full">Loading research papers...</p>
        ) : filteredPapers.length === 0 ? (
          <p className="text-sm text-gray-500 flex w-full">
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