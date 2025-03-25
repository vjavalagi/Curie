import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import PdfViewer from "../components/PdfViewer"; // Import the new iframe-based PDF viewer
import Card from "../components/Card";

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
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />

          {/* PDF List Section */}
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>

            <div className="flex flex-wrap gap-6 justify-center">
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              {/* Add more <Card /> components as needed */}
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