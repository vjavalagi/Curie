import React, { useState, useEffect, useRef } from "react";
import Tag from "./Tag";

export default function Card({
  name,
  authors,
  date,
  abstract,
  journal_ref,
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
      const arxivLink = links.find((link) => link.includes("arxiv.org"));
      const arxivIdMatch = arxivLink?.match(/\d{4}\.\d{5}(v\d+)?/);
      const arxivId = arxivIdMatch ? arxivIdMatch[0] : null;

      let bibtexContent = "";

      if (arxivId) {
        const response = await fetch(`https://arxiv.org/bibtex/${arxivId}`);
        bibtexContent = await response.text();

        if (bibtexContent.startsWith("@article")) {
          bibtexContent = bibtexContent.replace("@article", "@misc");
        }
      } else {
        bibtexContent = `@misc{${name.replace(/[^a-zA-Z0-9]/g, "_")},\n` +
          `  title={${name}},\n` +
          `  author={${authors?.join(" and ")}},\n` +
          (journal_ref ? `  journal={${journal_ref}},\n` : "") +
          `  year={${new Date(date).getFullYear()}},\n}`;
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
      <div className="relative flex flex-col h-full bg-white border border-gray-200 group w-80 shadow-2xs rounded-xl">
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
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  disabled={isCopying}
                >
                  {isCopying ? (
                    <div
                      className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-blue-600 rounded-full"
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
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 focus:outline-none"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onDeletePaper();
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete Paper
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-52 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl" />

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

        <h3 className="text-xl font-semibold text-gray-800 px-4">{name}</h3>
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