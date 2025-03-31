import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { SummarizeSectionsSent } from "../backend/SummarizeSectionsSent";
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload"; // Ensure correct path
import ActiveSummary from "./ActiveSummary";

export default function SearchLargeView() {
  const { search, activePaper, setActivePaper, setActiveSummary, activeSummary } = useGlobal();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    if (activeSummary === null) {
      setIsSummaryLoading(true);
    } else if (activeSummary) {
      setIsSummaryLoading(false);
    }
  }, [activeSummary]);

  const handleSummaryClick = async (summaryLength) => {
    // Trigger the SummarizeSectionsSent function with the appropriate summary length
    const summary = await SummarizeSectionsSent(activePaper.title, summaryLength);
    
    // Update the active summary in state
    setActiveSummary(summary);
  };

  const handleDeepDiveClick = () => {
    console.log("!!Current search value before download:", search);
    setActivePaper("");
    console.log("Emptying paper", activePaper);
  };

  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        {/* Beginner Buttons on Left */}
        <div className="flex gap-2">
          <div className="inline-flex rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => handleSummaryClick(3)}  // Medium summary
              className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-gray-200 gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Short
            </button>
            <button
              type="button"
              onClick={() => SummarizeSectionsSent(activePaper.title, 3)} 
              className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-gray-200 gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => SummarizeSectionsSent(activePaper.title, 6)} 
              className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-800 bg-white border border-gray-200 gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Long
            </button>
          </div>
        </div>
        
        {/* Deep Dive Button on Right */}
        <button
          className="px-4 py-2 text-white rounded-lg shadow-md bg-curieBlue hover:bg-blue-600"
          onClick={handleDeepDiveClick}
        >
          Contextualize ✨
        </button>
      </div>

      {/* Main content: render active paper details if available, otherwise a search summary */}
      {!activePaper ? (
        <section className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{search}</h1>
          <h2 className="mt-2 text-lg font-semibold">Summary</h2>
          <p className="text-gray-700">
            Shows an AI-generated summary of the field itself along with a timeline.
          </p>
          <Timeline search={search} />
        </section>
      ) : (
        <section className="relative p-6 bg-white rounded-lg shadow-md">

          <button
            className="absolute right-4 top-4 flex items-center gap-0.5 text-curieBlue hover:text-blue-700"
            onClick={() => PDFDownload(activePaper)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
              />
            </svg>
            <span className="text-sm underline">Save to Profile</span>
          </button>

          <h1 className="pr-12 text-2xl font-bold">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            Publication Date: {activePaper.published}
          </p>
          <p className="text-sm text-gray-500">
            Authors: {activePaper.authors?.join(", ")}
          </p>
          <p className="text-sm text-gray-500">Summary: {activePaper.summary}</p>
          <a
            href={activePaper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 bottom-1 flex items-center gap-0.5 text-curieBlue hover:text-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            <span className="text-sm underline">View Paper</span>
          </a>
        </section>

      )}

      {/* Render active summary section if an active paper is selected */}
    {activePaper && (
    <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Active Summary</h3>
      {activeSummary === undefined ? (
        <div className="flex items-center justify-center mt-4">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full bg-curieBlue animate-pulse"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>
      ) : (
        <ActiveSummary activeSummary={activeSummary} activePaper={activePaper} />
      )}
  </section>
)}

    </main>
  );
}
