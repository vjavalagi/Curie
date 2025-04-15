import React from "react";
import ActiveSummary from "./ActiveSummary";

export default function PaperModal({ isOpen, onClose, activePaper, activeSummary, onSliderChange }) {
  if (!isOpen || !activePaper || !activePaper.links?.[1]) return null;

  const summaryLength = Number(localStorage.getItem("current_summary_length") || 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-[95%] h-[90%] rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-6 text-2xl text-gray-600 hover:text-red-500 z-10"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-bold">{activePaper.title}</h2>
        </div>

        {/* Main content: Paper (left) + Summary (right) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: PDF Viewer */}
          <div className="w-[55%] h-full">
            <iframe
              src={activePaper.links[1]}
              title="Paper PDF"
              className="w-full h-full"
              frameBorder="0"
            />
          </div>

          {/* Right: Summary */}
          <div className="w-[45%] h-full p-6 overflow-y-auto border-l border-gray-200">
            {/* Header + Slider row */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Summary</h3>
              <div className="flex flex-col items-center">
                <input
                  id="summarySlider"
                  type="range"
                  min="2"
                  max="6"
                  step="2"
                  value={summaryLength}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    localStorage.setItem("current_summary_length", value);
                    onSliderChange(value);
                  }}
                  className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="relative w-48 mt-1 text-xs text-gray-500">
                  <span className="absolute left-0 transform -translate-x-1/2">📸</span>
                  <span className="absolute left-1/2 transform -translate-x-1/2">🔍</span>
                  <span className="absolute left-full transform -translate-x-full">✨</span>
                </div>
              </div>
            </div>

            {/* Summary Content */}
            <ActiveSummary activeSummary={activeSummary} activePaper={activePaper} />
          </div>
        </div>
      </div>
    </div>
  );
}
