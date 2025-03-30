import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import LogoutButton from "../components/LogoutButton";
import PdfViewer from "../components/PdfViewer"; // Ensure this component exists
import Folder from "../components/Folder";
import Card from "../components/Card";
import { useGlobal } from "../context/GlobalContext";

export default function ProfilePage() {
  const [tags, setTags] = useState([]);
  const { selectedPdf, fileSystem, setSelectedPdf } = useGlobal();
  const [pdfTags, setPdfTags] = useState({});

  const presetColors = [
    "#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E",
    "#14B8A6", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6",
    "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#6B7280",
    "#10B981", "#0EA5E9", "#F59E0B", "#7C3AED", "#DC2626"
  ];

  const handleAddTag = (name) => {
    const index = tags.length % presetColors.length;
    const newTag = { name, color: presetColors[index] };
    setTags((prev) => [...prev, newTag]);
  };

  const handleRemoveTagGlobally = (tagName) => {
    setTags((prev) => prev.filter((t) => t.name !== tagName));
    setPdfTags((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = prev[key].filter((t) => t.name !== tagName);
      }
      return updated;
    });
  };

  const handleAssignTag = (cardId, tag) => {
    setPdfTags((prev) => ({
      ...prev,
      [cardId]: prev[cardId]?.some((t) => t.name === tag.name)
        ? prev[cardId]
        : [...(prev[cardId] || []), tag],
    }));
  };

  const handleRemoveTagFromCard = (cardId, tagName) => {
    setPdfTags((prev) => ({
      ...prev,
      [cardId]: prev[cardId].filter((t) => t.name !== tagName),
    }));
  };

  // Recursive function to render the file system structure
  const renderFileSystem = (fs) => {
    if (!fs) return <div>No file system data available.</div>;

    return (
      <div>
        {/* Render folders */}
        {fs.folders.map((folder, idx) => (
          <div key={`folder-${idx}`} className="ml-4 my-2">
            <Folder name={folder.name} />
            {/* Recursively render the folder's content */}
            <div className="ml-6">
              {renderFileSystem(folder.content)}
            </div>
          </div>
        ))}
        {/* Render loose JSON files (papers) as Cards */}
        {fs.jsons.map((paper, idx) => (
          <div key={`paper-${paper.entry_id}-${idx}`} className="ml-4 my-2">
            <Card
              name={paper.title}
              authors={paper.authors}
              date={paper.published}
              abstract={paper.summary}
              tags={pdfTags[paper.entry_id] || []}
              availableTags={tags}
              onAssignTag={(tag) => handleAssignTag(paper.entry_id, tag)}
              onRemoveTagFromCard={(tagName) =>
                handleRemoveTagFromCard(paper.entry_id, tagName)
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTagGlobally}
        />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Saved PDFs
            </h2>
            {fileSystem ? (
              renderFileSystem(fileSystem)
            ) : (
              <div>No file system data available.</div>
            )}
          </div>
        </div>
      </div>
      <SaveGroupingButton />
      <LogoutButton />
      {/* Render PDF Viewer if a PDF is selected */}
      {selectedPdf && (
        <PdfViewer
          pdfUrl={selectedPdf}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </div>
  );
}
