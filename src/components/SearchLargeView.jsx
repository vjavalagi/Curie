import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { SummarizeSectionsSent } from "../backend/SummarizeSectionsSent";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";
import { PDFDownload } from "../backend/PdfDownload"; // Ensure correct path
import ActiveSummary from "./ActiveSummary";
import SaveToProfileModal from "./SaveToProfileModal"; // Adjust path if needed
import AskCurie from "./AskCurie";

export default function SearchLargeView() {
  const { search, activePaper, setActivePaper, setActiveSummary, activeSummary, user, fileSystem, setFileSystem } = useGlobal();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [activeSummaryLevel, setActiveSummaryLevel] = useState(3); // Insight is default - 3 sentences
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (activeSummary === null) {
      setIsSummaryLoading(true);
    } else if (activeSummary) {
      setIsSummaryLoading(false);
    }
  }, [activeSummary]);

  

  const handleSummaryClick = async (summaryLength) => {
    if (summaryLength === activeSummaryLevel) return; // prevent refresh if same
  
    setActiveSummary(undefined);
    setActiveSummaryLevel(summaryLength);
  
    const storageKey = `summary_${activePaper.title}_${summaryLength}`;
    const storedSummary = localStorage.getItem(storageKey);
  
    if (storedSummary) {
      setActiveSummary(JSON.parse(storedSummary));
    } else {
      const summary = await SummarizeSectionsSent(activePaper.title, summaryLength);
      localStorage.setItem(storageKey, JSON.stringify(summary));
      setActiveSummary(summary);
    }
  };
  

  // const handleDeepDiveClick = () => {
  //   console.log("!!Current search value before download:", search);
  //   setActivePaper("");
  //   console.log("Emptying paper", activePaper);
  // };

  // This function is called when the user clicks the "Save to Profile" button
  const handleSaveToProfileClick = () => {
    setShowSaveModal(true);
  };

  // This function is called when a folder is selected in the modal.
  // Pass an empty string to save loose.
  const handleFolderSelection = async (folderName) => {
    if (!activePaper) return;
    try {
      const response = await axios.post("http://localhost:5001/api/upload-paper-to-folder", {
        username: user["UserID"],
        folder: folderName, // if folderName is "", the paper is saved loose
        paper: activePaper,
      });
      console.log("Paper saved to folder:", response.data);
      setShowSaveModal(false);
    } catch (error) {
      console.error("Error saving paper to folder:", error);
    }
  };

  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        {/* Beginner Buttons on Left */}
        <div className="grid grid-cols-2 gap-2">
        </div>
        
        {/* Deep Dive Button on Right
        <button
          className="px-4 py-2 text-white rounded-lg shadow-md bg-curieBlue hover:bg-blue-600"
          onClick={handleDeepDiveClick}
        >
          Contextualize ✨
        </button> */}
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
          {/* Save to Profile Button */}
          <button
            className="absolute right-4 top-4 flex items-center gap-0.5 text-curieBlue hover:text-blue-700"
            onClick={handleSaveToProfileClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bookmark-icon lucide-bookmark w-5 h-5"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>
          <h1 className="pr-12 text-2xl font-bold">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            Publication Date: {activePaper.published}
          </p>
          <p className="text-sm text-gray-500">
            Authors: {activePaper.authors?.join(", ")}
          </p>
          
          {activePaper.links?.[0] && (
            <a
              href={activePaper.links[0]}
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
          )}

        </section>
      )}

      {/* Save-to-Profile Modal */}
      {showSaveModal && (
        <SaveToProfileModal
          fileSystem={fileSystem}
          onFolderSelect={handleFolderSelection}
          onClose={() => setShowSaveModal(false)}
        />
      )}


      {/* Render active summary section if an active paper is selected */}
    {activePaper && (
    <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
    {/* Flex container for title and buttons */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">Active Summary</h3>
      <div className="inline-flex rounded-lg shadow-2xs">
      <button
          type="button"
          onClick={() => handleSummaryClick(1)}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium border -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg
            ${activeSummaryLevel === 1
              ? "bg-curieBlue text-white border-curieBlue"
              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"}
          `}
        >
          Snapshot 📸
        </button>

        <button
          type="button"
          onClick={() => handleSummaryClick(3)}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium border -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg
            ${activeSummaryLevel === 3
              ? "bg-curieBlue text-white border-curieBlue"
              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"}
          `}
        >
          Insight 🔍
        </button>

        <button
          type="button"
          onClick={() => handleSummaryClick(6)}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium border -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg
            ${activeSummaryLevel === 6
              ? "bg-curieBlue text-white border-curieBlue"
              : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"}
          `}
        >
          DeepDive ✨
        </button>

      </div>
    </div>
  
    {/* Summary Content */}
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

      {/* Ask Curie Component */}
      {activePaper && (
        <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
          <AskCurie />
        </section>
  
)}

    </main>
  );
}
