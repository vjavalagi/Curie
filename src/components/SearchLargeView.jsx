import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { useGlobal } from "../context/GlobalContext";
import { PDFDownload } from "../backend/PdfDownload"; // Ensure correct path

export default function SearchLargeView() {
  const { search, activePaper, setActivePaper, activeSummary, user } = useGlobal();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    if (activeSummary === null) {
      setIsSummaryLoading(true);
    } else if (activeSummary) {
      setIsSummaryLoading(false);
    }
  }, [activeSummary]);

  const handleDeepDiveClick = () => {
    console.log("!!Current search value before download:", search);
    setActivePaper("");
    console.log("Emptying paper", activePaper);
  };

  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Beginner Buttons on Left */}
        <div className="flex gap-2">
          <div className="inline-flex rounded-lg shadow-2xs">
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Beginner
            </button>
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Intermediate
            </button>
            <button
              type="button"
              className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              Expert
            </button>
          </div>
        </div>

        {/* Deep Dive Button on Right */}
        <button
          className="px-4 py-2 bg-curieBlue text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={handleDeepDiveClick}
        >
          Contextualize ✨
        </button>
      </div>

      {/* Main content: render active paper details if available, otherwise a search summary */}
      {!activePaper ? (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{search}</h1>
          <h2 className="text-lg font-semibold mt-2">Summary</h2>
          <p className="text-gray-700">
            Shows an AI-generated summary of the field itself along with a
            timeline.
          </p>
          <Timeline search={search} />
        </section>
      ) : (
        <section className="bg-white p-6 rounded-lg shadow-md relative">
          <button
            className="absolute right-4 top-4 flex items-center gap-0.5 text-curieBlue hover:text-blue-700"
            onClick={() => PDFDownload(user, activePaper)}
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

          <h1 className="text-2xl font-bold pr-12">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            Publication Date: {activePaper.published}
          </p>
          <p className="text-sm text-gray-500">
            Authors: {activePaper.authors?.join(", ")}
          </p>
          <p className="text-sm text-gray-500">
            Summary: {activePaper.summary}
          </p>
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
        <section className="bg-white p-6 mt-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Active Summary</h3>
          {activeSummary === undefined ? (
            // Loading indicator
            <div className="flex justify-center items-center mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-curieBlue h-2 rounded-full animate-pulse"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
          ) : activeSummary && Object.keys(activeSummary).length > 0 ? (
            // Render summary sections if activeSummary has content
            <>
              {activeSummary.introduction && (
                <div className="mt-2">
                  <h4 className="font-bold">Introduction</h4>
                  <p>{activeSummary.introduction}</p>
                </div>
              )}
              {activeSummary.methods && (
                <div className="mt-2">
                  <h4 className="font-bold">Methods</h4>
                  <p>{activeSummary.methods}</p>
                </div>
              )}
              {activeSummary.results && (
                <div className="mt-2">
                  <h4 className="font-bold">Results</h4>
                  <p>{activeSummary.results}</p>
                </div>
              )}
              {activeSummary.discussion && (
                <div className="mt-2">
                  <h4 className="font-bold">Discussion</h4>
                  <p>{activeSummary.discussion}</p>
                </div>
              )}
              {activeSummary.conclusion && (
                <div className="mt-2">
                  <h4 className="font-bold">Conclusion</h4>
                  <p>{activeSummary.conclusion}</p>
                </div>
              )}
            </>
          ) : (
            // If activeSummary is null or an empty object
            <p>No AI Gen summary is available for this paper.</p>
          )}
        </section>
      )}
    </main>
  );
}
