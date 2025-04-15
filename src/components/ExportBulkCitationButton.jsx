import React, { useState } from "react";

export default function ExportBulkCitationButton({ papers, folderName }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportBibtex = async () => {
    setIsExporting(true);

    const bibtexEntries = await Promise.all(
      papers.map(async (paper) => {
        const arxivUrl = paper.pdf_url;
        const arxivIdMatch = arxivUrl?.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{5})(v\d+)?/);
        const arxivId = arxivIdMatch ? arxivIdMatch[1] + (arxivIdMatch[2] || "") : null;

        if (arxivId) {
          try {
            const response = await fetch(`http://localhost:5001/api/arxiv-bibtex?arxiv_id=${arxivId}`);
            const data = await response.json();
            if (data.bibtex) return data.bibtex;
          } catch (err) {
            console.warn(`BibTeX fetch failed for ${arxivId}, falling back`);
          }
        }

        // Fallback
        const safeId = paper.title?.replace(/[^a-zA-Z0-9]/g, "_");
        return (
          `@misc{${safeId},\n` +
          `  title={${paper.title}},\n` +
          `  author={${paper.authors?.join(" and ") || "Unknown"}},\n` +
          (paper.journal_ref ? `  journal={${paper.journal_ref}},\n` : "") +
          `  year={${new Date(paper.published || Date.now()).getFullYear()}},\n` +
          `}`
        );
      })
    );

    const fileContent = bibtexEntries.join("\n\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${folderName}_citations.bib`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-4"
      onClick={handleExportBibtex}
      disabled={isExporting}
    >
      {isExporting ? "Exporting..." : "Export Bulk Citation"}
    </button>
  );
}
