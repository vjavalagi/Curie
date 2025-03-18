import React, { useState, useEffect } from "react";
import { checkPdfExists } from "../backend/PdfDownload"; 
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload";

export default function SearchLargeView() {
  const { search, activePaper, setActivePaper } = useGlobal();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPdfValid, setIsPdfValid] = useState(false);

  // Check if the PDF exists whenever activePaper changes
  useEffect(() => {
    if (!activePaper?.pdf_url) {
        setIsPdfValid(false);
        return;
    }
    
    // Ensure activePaper is fully updated before checking
    const timer = setTimeout(() => {
        checkPdfExists(activePaper.pdf_url).then(setIsPdfValid);
    }, 200); 

    return () => clearTimeout(timer); // Cleanup previous checks
  }, [activePaper]);

  const handlePdfDownloadClick = async () => {
    if (!activePaper?.pdf_url || !isPdfValid) return;

    setIsDownloading(true);
    console.log("Downloading PDF:", activePaper.pdf_url);

    try {
      await PDFDownload(activePaper.pdf_url, activePaper.title);
      console.log("Download completed!");
    } catch (error) {
      console.error("Download failed:", error);
    }

    setIsDownloading(false);
  };

  const handleDeepDiveClick = () => {
    console.log("Deep Dive Clicked - Clearing active paper");
    setActivePaper(null);
  };

  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        
        <div className="flex gap-2">
          <div class="inline-flex rounded-lg shadow-2xs">
            <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              Beginner
            </button>
            <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              Intermediate
            </button>
            <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              Expert
            </button>
        </div>
          
          {/* Download PDF Button */}
          <button
            type="button"
            className={`px-4 py-2 min-w-[150px] text-sm font-medium rounded-lg border ${
              isPdfValid ? "bg-white text-gray-800 hover:bg-gray-50" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handlePdfDownloadClick}
            disabled={!isPdfValid || isDownloading} 
          >
            {isDownloading ? "Downloading..." : "Download to Profile"}
          </button>
        </div>

        {/* Deep Dive Button */}
        <button className="px-4 py-2 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={handleDeepDiveClick}
        >
          Deep Dive ✨
        </button>
      </div>

      {/* Paper Details */}
      {activePaper ? (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            <strong>Publication Date:</strong> {activePaper.published}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Authors:</strong> {activePaper.authors.join(", ")}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Abstract:</strong> {activePaper.summary}
          </p>
          <a href={activePaper.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            View Paper
          </a>

          {/* JSON Viewer (Always Visible) */}
          <div className="mt-4 p-4 bg-gray-900 text-white rounded-md overflow-auto shadow-lg max-h-96">
            <pre className="whitespace-pre-wrap text-sm">
              <code>{JSON.stringify(activePaper, null, 2)}</code>
            </pre>
          </div>
        </section>
      ) : (
        <p className="text-gray-500">Select a paper to view details.</p>
      )}
    </main>
  );
}
