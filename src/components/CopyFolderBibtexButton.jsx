// components/CopyFolderBibtexButton.jsx
import React, { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


export default function CopyFolderBibtexButton({ papers }) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = async () => {
    setIsCopying(true);
    setCopied(false);

    const bibtexEntries = await Promise.all(
      papers.map(async (paper) => {
        const arxivUrl = paper.pdf_url;
        const arxivIdMatch = arxivUrl?.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{5})(v\d+)?/);
        const arxivId = arxivIdMatch ? arxivIdMatch[1] + (arxivIdMatch[2] || "") : null;

        if (arxivId) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/arxiv-bibtex?arxiv_id=${arxivId}`);
            const data = await response.json();
            if (data.bibtex) return data.bibtex;
          } catch (err) {
            console.warn(`BibTeX fetch failed for ${arxivId}, falling back`);
          }
        }

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

    const bibtexText = bibtexEntries.join("\n\n");

    try {
      await navigator.clipboard.writeText(bibtexText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy BibTeX to clipboard:", err);
    }

    setIsCopying(false);
  };

  return (
    <button
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ml-2"
      onClick={handleCopyBibtex}
      disabled={isCopying}
    >
      {isCopying ? "Copying..." : copied ? "Copied!" : "Copy Folder BibTeX"}
    </button>
  );
}
