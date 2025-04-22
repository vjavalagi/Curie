import React, { useState, useEffect, useRef } from "react";
import ActiveSummary from "./ActiveSummary";
import AskCurie from "./AskCurie";
import { motion, AnimatePresence } from "framer-motion";

export default function PaperModal({ isOpen, onClose, activePaper, activeSummary, onSliderChange }) {
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeSummary === undefined || activeSummary === null) {
      setIsSummaryLoading(true);
    } else {
      setIsSummaryLoading(false);
    }
  }, [activeSummary]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const summaryLength = Number(localStorage.getItem("current_summary_length") || 4);
  const [sliderValue, setSliderValue] = useState(summaryLength);


  useEffect(() => {
    const stored = localStorage.getItem('current_summary_length');
    if (stored) {
      setSliderValue(Number(stored));
    } else if (activePaper?.current_summary_length !== undefined) {
      setSliderValue(activePaper.current_summary_length);
    }
  }, [activePaper]);
  
  return (
    <AnimatePresence>
      {isOpen && activePaper && activePaper.links?.[1] && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // fade backdrop faster
        >
          <motion.div
            ref={modalRef}
            className="bg-white w-[95%] h-[95%] rounded-lg shadow-2xl flex flex-col overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeInOut" }} // quicker transition
          >
            {/* Close button */}
            <button
              className="absolute z-10 text-2xl text-gray-600 top-4 right-6 hover:text-red-500"
              onClick={onClose}
            >
              ✕
            </button>

            {/* Title */}
            <div className="px-6 pt-4 pb-2 text-center border-b border-gray-200">
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

                {/* Ask Curie Component */}
                {activePaper && (
                <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
                    <AskCurie />
                </section>
                )}

                {/* Header + Slider row */}
                <section className="p-6 mt-4 bg-white rounded-lg shadow-md">
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
      //value={[sliderValue]}
      value={localStorage.getItem("current_summary_length") || 4} // <--- retrieve it globally
      onChange={(e) => {
        const value = Number(e.target.value);
        setSliderValue(value); 
        localStorage.setItem("current_summary_length", value); // <--- store it globally
        onSliderChange(value); // existing logic
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
                {isSummaryLoading ? (
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
              </div>
              
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
