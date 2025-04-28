import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { SummarizeSectionsSent } from "../backend/SummarizeSectionsSent";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";
import { PDFDownload } from "../backend/PdfDownload"; // Ensure correct path
import ActiveSummary from "./ActiveSummary";
import SaveToProfileModal from "./SaveToProfileModal"; // Adjust path if needed
import AskCurie from "./AskCurie";
import PaperModal from "./PaperModal";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


export default function SearchLargeView() {
  const { search, activePaper, setActivePaper, setActiveSummary, activeSummary, user, fileSystem, setFileSystem } = useGlobal();
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);

  const [sliderValue, setSliderValue] = useState(() => {
    return Number(localStorage.getItem("current_summary_length")) || 4;
  });


  useEffect(() => {
    if (activeSummary === null) {
      setIsSummaryLoading(true);
    } 
    else if (activeSummary) {
      setIsSummaryLoading(false);
    }
  }, [activeSummary]);

  // useEffect(() => {
  //   if (activePaper) {
  //     handleSummaryClick(sliderValue);
  //   }
  // }, [activePaper]);

  const handleSummaryClick = async (summaryLength) => {
    setActiveSummary(undefined);
    setSliderValue(summaryLength);
    localStorage.setItem("current_summary_length", summaryLength);
  
    const cacheKey = `summary_${activePaper.title}`;
    const cachedSummaryData = localStorage.getItem(cacheKey);
  
    if (!cachedSummaryData) {
      // Summary not cached — do nothing
      return;
    }
  
    const parsedSummary = JSON.parse(cachedSummaryData);
  
    const summaryContent = {
      title: parsedSummary.title,
      introduction: parsedSummary.introduction,
      content: parsedSummary.content.map((item) => ({
        section: item.section,
        summary:
          summaryLength === 2
            ? item.two_entence_summary
            : summaryLength === 4
            ? item.four_sentence_summary
            : item.six_sentence_summary,
      })),
      conclusion: parsedSummary.conclusion,
    };
  
    setActiveSummary(summaryContent);
  };
  
  
  //clear storage when refresh page
  useEffect(() => {
    handleSummaryClick(sliderValue);
  }, []);

  
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
      const response = await axios.post(`${API_BASE_URL}/api/upload-paper-to-folder`, {
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
    <main className="flex-1 p-4 pt-4 overflow-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        {/* Beginner Buttons on Left */}
        
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
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-300">
        <div className>
          {/* image of Curiehat.png */}
          <img
            src="/assets/Curiehat.png"
            alt="Curie Hat"
            className="w-32 h-32"
          />
        </div>

        <h2 className="text-lg font-medium text-gray-500">Select an item to read about {search}</h2>
        <p className="text-sm mt-1 text-gray-400">Nothing is selected</p>
      </div>
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
              className="w-5 h-5 lucide lucide-bookmark-icon lucide-bookmark"
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

        {/* Abstract */}
          <p className="text-sm text-gray-500">
            Abstract: {activePaper.summary}
          </p>

          {activePaper.links?.[0] && (
            <button
            onClick={() => setShowPaperModal(true)}
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
          </button>
          
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


    {/* Ask Curie Component */}
          {activePaper && (
        <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
          <AskCurie />
        </section>
    )}


      {/* Render active summary section if an active paper is selected */}
    {activePaper && (
    <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
    {/* Flex container for title and buttons */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">Active Summary</h3>
      <div className="inline-flex rounded-lg shadow-2xs">
      <div className="flex flex-col items-center w-full">


  <div className="relative flex flex-col items-center w-full pr-8">
    <label htmlFor="summarySlider" className="py-1 space-y-1 font-medium text-center text-black t-sm py-">
      Summary Length
    </label>

    {/* Slider */}
    <input
      id="summarySlider"
      type="range"
      min="2"
      max="6"
      step="2"
      // value={localStorage.getItem("current_summary_length") || 4} // <--- retrieve it globally
      value={sliderValue}
      onChange={(e) => {
        const value = Number(e.target.value);
        setSliderValue(value); // ← Keep internal state in sync
        localStorage.setItem("current_summary_length", value); // <--- store it globally
        handleSummaryClick(value); // existing logic
      }}
      //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:h-4 
      [&::-webkit-slider-thumb]:w-4 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-[#1a2d8d] 
      [&::-webkit-slider-thumb]:shadow-md 
      [&::-moz-range-thumb]:appearance-none 
      [&::-moz-range-thumb]:h-4 
      [&::-moz-range-thumb]:w-4 
      [&::-moz-range-thumb]:rounded-full 
      [&::-moz-range-thumb]:bg-[#1a2d8d]"

    />

    {/* Label markers aligned to slider dot positions */}
    <div className="space-y-1 left-0 bottom-[-1.5rem] w-full">
      <div className="relative w-full">
        {/* Position 2 (left dot) */}
        <span className="absolute left-0 text-xs text-gray-500 transform -translate-x-1/2 top-1">
          Snapshot
        </span>

        {/* Position 4 (middle dot) */}
        <span className="absolute text-xs text-gray-500 transform -translate-x-1/2 left-1/2 top-1">
          Insight
        </span>

        {/* Position 6 (right dot) */}
        <span className="absolute text-xs text-gray-500 transform -translate-x-1/2 left-full top-1">
          DeepDive
        </span>
      </div>
    </div>
  </div>
</div>




      </div>
    </div>

  
    {/* Summary Content */}
    {activeSummary === undefined ? (
      <div className="flex items-center justify-center mt-10">
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
      {/* {activePaper && (
        <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
          <AskCurie />
        </section>
      )} */}

      {/* Paper Modal */}
      <PaperModal
        isOpen={showPaperModal}
        //onClose={() => setShowPaperModal(false)}
        onClose={() => {
          setShowPaperModal(false);
          const storedSlider = Number(localStorage.getItem("current_summary_length")) || 4;
          handleSummaryClick(storedSlider); // <-- Re-fetch summary on modal close
        }}
        activePaper={activePaper}
        activeSummary={activeSummary}
        sliderValue={sliderValue}
        onSliderChange={handleSummaryClick}
      />

    </main>
  );
}