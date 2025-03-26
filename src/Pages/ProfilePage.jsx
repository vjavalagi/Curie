import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import Card from "../components/Card";

export default function ProfilePage() {
  const [tags, setTags] = useState([
    { name: "Tag 1", color: "#1a2d8d" },
    { name: "Tag 2", color: "#cbf8fc" },
  ]);

  const [pdfTags, setPdfTags] = useState({});

  const dummyCards = [1, 2, 3, 4, 5]; // Dummy IDs

  const handleAddTag = (newTag) => {
    setTags((prev) => [...prev, newTag]);
  };

  const handleAssignTag = (cardId, tag) => {
    setPdfTags((prev) => ({
      ...prev,
      [cardId]: prev[cardId]?.some((t) => t.name === tag.name)
        ? prev[cardId]
        : [...(prev[cardId] || []), tag],
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown tags={tags} onAddTag={handleAddTag} />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {dummyCards.map((id) => (
                <Card
                  key={id}
                  pdfId={id}
                  tags={pdfTags[id] || []}
                  availableTags={tags}
                  onAssignTag={(tag) => handleAssignTag(id, tag)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
