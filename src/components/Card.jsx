import React, { useState, useEffect, useRef } from "react";
import Tag from "./Tag";

export default function Card({
  paperId, 
  name,
  authors,
  date,
  abstract,
  journal_ref,
  folders = [],
  tags = [],
  onAssignTag,
  onRemoveTagFromCard,
  onDeletePaper,
  availableTags = [],
  onClickTag,
  activeFilters = [],
  selectedYearFilter,
  onClickYear,
  activeAuthorFilters = [],
  onClickAuthor,
  links = [],
  currentFolder,
  onMovePaper,
  paper_url,
  onViewPaper,
}) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCopyBibtex = async () => {
    setIsCopying(true);

    try {
      
      const arxivUrl = links;

      if (!arxivUrl || (!arxivUrl.includes("arxiv.org/abs") && !arxivUrl.includes("arxiv.org/pdf"))) {
        console.error("No valid arXiv URL found.");
        setIsCopying(false);
        return;
      }

      if (!arxivUrl) {
        console.error("No arXiv URL found in the links array.");
        setIsCopying(false);
        return;
      }

      const arxivIdMatch = arxivUrl.match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{5})(v\d+)?/);
      const arxivId = arxivIdMatch ? arxivIdMatch[1] + (arxivIdMatch[2] || "") : null;

      let bibtexContent = "";

      if (arxivId) {
        const response = await fetch(`http://localhost:5001/api/arxiv-bibtex?arxiv_id=${arxivId}`);
        const data = await response.json();

        if (data.bibtex) {
          bibtexContent = data.bibtex;
        } else {
          throw new Error("No bibtex returned from backend.");
        }
      } else {
        console.warn("Could not extract arXiv ID — falling back to basic bibtex.");
        bibtexContent =
          `@misc{${name?.replace(/[^a-zA-Z0-9]/g, "_")},\n` +
          `  title={${name}},\n` +
          `  author={${authors?.join(" and ")}},\n` +
          (journal_ref ? `  journal={${journal_ref}},\n` : "") +
          `  year={${new Date(date || Date.now()).getFullYear()}},\n}`;
      }

      await navigator.clipboard.writeText(bibtexContent);
      setIsCopying(false);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Error copying BibTeX:", err);
      setIsCopying(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative flex flex-col h-full bg-white border border-gray-300 group w-80 shadow-2xs rounded-xl">
        {copied && (
          <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded shadow z-30">
            Copied!
          </div>
        )}

        <div className="absolute z-10 top-2 right-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
            className="flex items-center justify-center text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg p-2 shadow hover:bg-gray-50 focus:outline-none cursor-pointer"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            aria-label="Dropdown"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-md z-20">
              <div className="p-1 space-y-1">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg">
                    <span className="flex items-center gap-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add tags
                    </span>
                  </summary>
                  <div className="ml-4 mt-1 space-y-1">
                    {availableTags.map((tag, idx) => {
                      const alreadyAdded = tags.some((t) => t.name === tag.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => !alreadyAdded && onAssignTag(tag)}
                          className={`text-sm text-left px-2 py-1 w-full rounded flex items-center gap-2 ${
                            alreadyAdded
                              ? "text-gray-400 cursor-not-allowed opacity-60"
                              : "text-gray-700 hover:bg-gray-200"
                          }`}
                          disabled={alreadyAdded}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                          {tag.name}
                          {alreadyAdded && <span className="text-xs ml-auto">(Added)</span>}
                        </button>
                      );
                    })}
                  </div>
                </details>
                

                <button
                  onClick={handleCopyBibtex}
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                  disabled={isCopying}
                >
                  {isCopying ? (
                    <div
                      className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-blue-600 rounded-lg"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Copy BibTeX"
                  )}
                </button>
                
                {onDeletePaper && (
                  <button
                    className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 "
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onDeletePaper(paperId); 
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete Paper
                  </button>
                )}
                {onMovePaper && folders.length > 0 && (
                  <>
                    <hr className="my-1 border-gray-200" />
                    <div className="px-2 py-1 text-sm text-gray-600">Move to folder:</div>

                    {folders
                      .filter((folder) => folder.name !== currentFolder) 
                      .map((folder) => (
                        <button
                          key={folder.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(false);
                            onMovePaper(paperId, currentFolder || "", folder.name);
                          }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-100 text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500 shrink-0"
                        >
                          <path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
                          <path d="M2 13h10" />
                          <path d="m9 16 3-3-3-3" />
                        </svg>
                        {folder.name}
                     </button>
                     
                    
                    ))}

                    {currentFolder && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDropdownOpen(false);
                          onMovePaper(paperId, currentFolder, "");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        <svg
                        
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          className="text-gray-500 min-w-[14px] min-h-[14px]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>
                        </svg>
                        Loose Papers
                      </button>
                    )}
                  </>
                )}

              </div>
            </div>
          )}
        </div>
        
        <div className="h-52 rounded-t-xl overflow-hidden bg-white relative">
          <iframe
            src={paper_url}
            title="Paper Preview"
            className="absolute top-0 left-0 w-full h-full bg-white pointer-events-none"
            style={{ border: "none",
              transform: "scale(1.05)", // Zoom in by 10%
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-white pointer-events-none" />
        </div>



        <div className="inline-flex flex-wrap gap-2 mb-1.5 pt-1 pl-1">
          <span
            onClick={() => onClickYear(date?.slice(0, 4))}
            className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
              selectedYearFilter === date?.slice(0, 4)
                ? "bg-curieBlue text-white ring-2 ring-offset-1 ring-curieBlue"
                : "bg-curieBlue text-curieLightBlue"
            }`}
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {date?.slice(0, 4)}
          </span>

          {tags.map((tag, idx) => {
            const isActive = activeFilters?.includes(tag.name);
            return (
              <span
                key={idx}
                onClick={() => onClickTag && onClickTag(tag.name)}
                className={`py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full text-white cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
                  isActive ? "ring-2 ring-offset-1 ring-curieBlue" : ""
                }`}
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTagFromCard(tag.name);
                  }}
                  className="ml-1 text-white hover:text-red-200 text-xs"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        <h3
          className="text-xl font-semibold text-gray-800 px-4 cursor-pointer hover:underline hover:text-curieBlue transition"
          onClick={() => onViewPaper && onViewPaper()}
        >
          {name}
        </h3>


        <div className="inline-flex flex-wrap gap-2 mb-1.5 mt-1.5 px-4">
          {authors &&
            authors.map((author, idx) => {
              const isActive = activeAuthorFilters.some(
                (active) => active.toLowerCase() === author.toLowerCase()
              );
              return (
                <span
                  key={idx}
                  onClick={() => onClickAuthor(author)}
                  className={`py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-full cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
                    isActive
                      ? "bg-curieLightGray text-black ring-2 ring-offset-2 ring-offset-white ring-curieBlue"
                      : "bg-curieLightGray text-black"
                  }`}
                >
                  {author}
                </span>
              );
            })}
        </div>
        <div className="h-20 overflow-hidden text-sm text-gray-600 px-4 pb-4">
          <p>{abstract}</p>
        </div>
      </div>
    </div>
  );
}
