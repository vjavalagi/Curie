import React, { useMemo } from "react";
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";
import { SummarizeSections } from "../backend/SummarizeSections";

export default function SearchSideBar({ selectedFilter, yearRange, researchPapers, loading }) {
  const { setActivePaper, setActiveSummary } = useGlobal();

  const handlePaperClick = async (paper) => {
    try {
      setActivePaper(paper);
      // Indicate that the summary is loading.
      setActiveSummary(undefined);
      await PDFDownload(paper);
      const sumresp = await SummarizeSections(paper.title);
      setActiveSummary(sumresp);
    } catch (error) {
      setActiveSummary(null);
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
    <aside className="flex h-screen w-1/4 bg-white border-r shadow-md overflow-hidden">
      <div className="p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">Research Papers</h2>
        {loading ? (
          <p>Loading research papers...</p>
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
