import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import PdfViewer from "../components/PdfViewer"; // Import the new iframe-based PDF viewer

export default function ProfilePage() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Fetch PDFs from the backend
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/list-pdfs")
      .then((res) => res.json())
      .then((data) => setPdfs(data))
      .catch((err) => console.error("Error fetching PDFs:", err));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown 
          currentDirectory="Home"
          folders={[]} 
          onSelect={() => {}}
        />
        <div className="flex flex-col flex-1 items-center pt-3">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />

          {/* PDF List Section */}
          <div className="w-full max-w-6xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {pdfs.length > 0 ? (
                pdfs.map((pdf, index) => (
                  <div key={index} className="flex flex-col items-center w-40">
                    <button
                      onClick={() => setSelectedPdf(`http://127.0.0.1:5001/pdfs/${pdf.filename}`)}
                      className="flex flex-col items-center text-gray-700 hover:text-blue-600"
                    >
                      {/* Paper Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-16 h-16"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                        />
                      </svg>

                      {/* PDF Title with Line Breaks Every 20 Characters */}
                      <span className="text-sm text-center mt-2 w-full break-words">
                        {pdf.title.match(/.{1,20}/g).join("\n")}
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No PDFs saved yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
      <SaveGroupingButton />

      {/* Render PDF Viewer if a PDF is selected */}
      {selectedPdf && <PdfViewer pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />}
    </div>
  );
}
