import React, { useState } from "react";

export default function ExportBulkCitationButton({ papers }) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExportBibtex = async () => {
    setIsExporting(true);
    setError(null);

    const bibtexEntries = await Promise.all(
      papers.map(async (paper) => {
        const arxivUrl = paper.pdf_url;

        if (!arxivUrl || (!arxivUrl.includes("arxiv.org/abs") && !arxivUrl.includes("arxiv.org/pdf"))) {
          console.warn(`Skipping invalid arXiv URL for paper: ${paper.title}`);
          return generateFallbackBibtex(paper);
        }

        const arxivIdMatch = arxivUrl.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{5})(v\d+)?/);
        const arxivId = arxivIdMatch ? arxivIdMatch[1] + (arxivIdMatch[2] || "") : null;

        if (!arxivId) {
          console.warn(`No valid arXiv ID found for: ${paper.title}`);
          return generateFallbackBibtex(paper);
        }

        try {
          const response = await fetch(`http://localhost:5001/api/arxiv-bibtex?arxiv_id=${arxivId}`);
          const data = await response.json();

          if (data.bibtex) {
            return data.bibtex;
          } else {
            return generateFallbackBibtex(paper);
          }
        } catch (err) {
          console.error(`Error fetching BibTeX for ${arxivId}:`, err);
          return generateFallbackBibtex(paper);
        }
      })
    );

    const bibtexFile = bibtexEntries.join("\n\n");
    const blob = new Blob([bibtexFile], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "folder_citations.bib";
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const generateFallbackBibtex = (paper) => {
    const cleanId = paper.title?.replace(/[^a-zA-Z0-9]/g, "_");
    const authors = paper.authors?.join(" and ") || "Unknown";
    const year = new Date(paper.published || Date.now()).getFullYear();

    return (
      `@misc{${cleanId},\n` +
      `  title={${paper.title}},\n` +
      `  author={${authors}},\n` +
      (paper.journal_ref ? `  journal={${paper.journal_ref}},\n` : "") +
      `  year={${year}},\n` +
      `}`
    );
  };

  return (
    <button
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick={handleExportBibtex}
      disabled={isExporting}
    >
      {isExporting ? "Exporting..." : "Export Bulk Citation"}
    </button>
  );
}
