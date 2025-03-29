import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import Card from "../components/Card";
import LogoutButton from "../components/LogoutButton";

export default function ProfilePage() {
  const [tags, setTags] = useState([]);

  const [pdfTags, setPdfTags] = useState({});
  const dummyCards = [1, 2, 3, 4, 5];

  const presetColors = [
    "#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E",
    "#14B8A6", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6",
    "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#6B7280",
    "#10B981", "#0EA5E9", "#F59E0B", "#7C3AED", "#DC2626"
  ];

  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilterTag = (tagName) => {
    setActiveFilters((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const cardMatchesFilters = (cardTags) => {
    if (activeFilters.length === 0) return true;
    return activeFilters.every((filter) =>
      cardTags.some((t) => t.name === filter)
    );
  };


  const handleAddTag = (name) => {
    const index = tags.length % presetColors.length;
    const newTag = {
      name,
      color: presetColors[index],
    };
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
      <DirectoryDropdown
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTagGlobally}
        onClickTag={toggleFilterTag}
        activeFilters={activeFilters}
      />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>
            <div className="flex flex-wrap gap-6 justify-center">
            {dummyCards.map((id) => {
              const cardTags = pdfTags[id] || [];
              const matches = cardMatchesFilters(cardTags);

              return (
                <div
                  key={id}
                  className={matches ? "" : "opacity-40 transition-opacity duration-300"}
                >
                  <Card
                    pdfId={id}
                    tags={cardTags}
                    availableTags={tags}
                    onAssignTag={(tag) => handleAssignTag(id, tag)}
                    onRemoveTagFromCard={(tagName) => handleRemoveTagFromCard(id, tagName)}
                    onClickTag={toggleFilterTag}
                    activeFilters={activeFilters}
                  />
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
