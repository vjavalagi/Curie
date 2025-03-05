import React from "react";
import Timeline from "./Timeline";
import { useGlobal } from "./GlobalContext";
import { PDFDownload } from "../backend/PdfDownload"; // Ensure correct path
import { useState } from "react";



export default function SearchLargeView() {
  const { search, activePaper, setActivePaper} = useGlobal();
  const [isDownloading, setIsDownloading] = useState(false); // ✅ Track loading state

  const handleDeepDiveClick = () => {
    console.log("!!Current search value before download:", search);

    setActivePaper("");
    console.log("Emptying paper", activePaper)
  }
  const handlePdfDownloadClick = async () => {
    if (!activePaper?.openAccessPdf?.url) return;

    setIsDownloading(true);
    console.log("Downloading PDF:", activePaper.openAccessPdf.url);

    try {
      await PDFDownload(activePaper.openAccessPdf.url, activePaper.title);
      console.log("Download completed!");
    } catch (error) {
      console.error("Download failed:", error);
    }

    setIsDownloading(false);
  };


  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Beginner Buttons on Left */}
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
        <button
            type="button"
            className="flex justify-center items-center px-4 py-2 min-w-[150px] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            onClick={handlePdfDownloadClick}
            disabled={!activePaper?.openAccessPdf?.url || isDownloading} 
          >
            {isDownloading ? (
              <span
                className="animate-spin inline-block size-4 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </span>
            ) : (
              "Download to Profile"
            )}
          </button>
        </div>

        {/* Deep Dive Button on Right */}
        <button className="px-4 py-2 bg-curieBlue text-white rounded-lg shadow-md hover:bg-blue-600"
        onClick={()=>handleDeepDiveClick()}
        >
          Deep Dive ✨
          
        </button >
      </div>

      {/* Conditionally render based on activePaper */}
      {!activePaper ? (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{search}</h1>
          <h2 className="text-lg font-semibold mt-2">Summary</h2>
          <p className="text-gray-700">
            Shows an AI-generated summary of the field itself along with a timeline.
          </p>
          <Timeline search = {search}/>
        </section>
      ) : (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">{activePaper.title}</h1>
          <p className="text-sm text-gray-500">
            Publication Date: {activePaper.publicationDate}
          </p>
          <p className="text-sm text-gray-500">
            Publication Types:{" "}
            {activePaper.publicationTypes?.join(", ")}
          </p>
          
          <p className="text-sm text-gray-500">
            Times Cited: {activePaper.citationCount}
           
          </p>
          <a
            href={activePaper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-curieBlue underline"
          >
            View Paper
          </a>
        </section>
      )}
    </main>
  );
}
