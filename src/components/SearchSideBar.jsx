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
      setActivePaper(paper);
      setActiveSummary(undefined); // Clear previous summary immediately
      setLoadingSummary(true); // Indicate that the summary is being checked/loaded

      // Store the current paper reference to prevent outdated updates
      currentPaperRef.current = paper;

      // Check if the summary already exists

      //const storedSummary = localStorage.getItem(`summary_4_${paper.title}`);

      const summaryLength =
        Number(localStorage.getItem("current_summary_length")) || 4;
      const storageKey = `summary_${summaryLength}_${paper.title}`;
      const storedSummary = localStorage.getItem(storageKey);

      if (storedSummary) {
        if (currentPaperRef.current === paper) {
          setActiveSummary(JSON.parse(storedSummary)); // Load from cache
        }
        setLoadingSummary(false);
        return;
      }

      // If not found, proceed to fetch summary
      await PDFDownload(paper);
      //const sumresp = await SummarizeSectionsSent(paper.title, 4);

      const sumresp = await SummarizeSectionsSent(paper.title, summaryLength);
      //localStorage.setItem(storageKey, JSON.stringify(sumresp));

      // Ensure it's still the active paper before setting the summary
      if (currentPaperRef.current === paper) {
        setActiveSummary(sumresp);
        localStorage.setItem(storageKey, JSON.stringify(sumresp));
        //localStorage.setItem(`summary_4_${paper.title}`, JSON.stringify(sumresp));
      }

      setLoadingSummary(false);
    } catch (error) {
      setActiveSummary(null);
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