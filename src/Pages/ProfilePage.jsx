import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

export default function ProfilePage() {
  const allFolders = {
    "Folder 1": ["Subfolder 1A", "Subfolder 1B"],
    "Folder 2": ["Subfolder 2A"],
    "Folder 3": [],
    "Folder 4": ["Subfolder 4A", "Subfolder 4B"],
    "Folder 5": []
  };

  const [folderPath, setFolderPath] = useState([]); // Breadcrumb state
  const [filteredFolder, setFilteredFolder] = useState(null); // Dropdown filter
  const [animating, setAnimating] = useState(false); // Controls animation

  let visibleFolders = Object.keys(allFolders);
  if (filteredFolder) {
    visibleFolders = [filteredFolder];
  } else if (folderPath.length > 0) {
    const lastFolder = folderPath[folderPath.length - 1];
    visibleFolders = allFolders[lastFolder] || [];
  }

  // Handle folder click with animation
  const handleFolderClick = (folder) => {
    setAnimating(true);
    setTimeout(() => {
      setFolderPath([...folderPath, folder]);
      setFilteredFolder(null);
      setAnimating(false);
    }, 300);
  };

  // Handle directory dropdown selection with animation
  const handleDirectorySelect = (folder) => {
    setAnimating(true);
    setTimeout(() => {
      setFilteredFolder(folder);
      setFolderPath([]); // Reset breadcrumb when filtering
      setAnimating(false);
    }, 300);
  };

  // Handle breadcrumb navigation with animation
  const handleBreadcrumbNavigate = (newPath) => {
    setAnimating(true);
    setTimeout(() => {
      setFolderPath(newPath);
      setFilteredFolder(null);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown 
          currentDirectory={folderPath.length > 0 ? folderPath[folderPath.length - 1] : "Home"} 
          folders={filteredFolder ? [filteredFolder] : Object.keys(allFolders)} 
          onSelect={handleDirectorySelect} 
        />
        <div className="flex flex-col flex-1 items-center">
          <div className="text-center mt-6">
            <WelcomeMessage />
          </div>

          {/* Breadcrumb Navigation - Always Visible */}
          <BreadcrumbNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />

          {/* Folder Grid with animations */}
          <FolderGrid 
            folders={visibleFolders} 
            onFolderClick={handleFolderClick} 
            animating={animating} 
          />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
