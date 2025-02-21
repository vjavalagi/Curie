import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

export default function ProfilePage() {
  // Folder structure with subfolders
  const allFolders = {
    "Folder 1": ["Subfolder 1A", "Subfolder 1B"],
    "Folder 2": ["Subfolder 2A"],
    "Folder 3": [],
    "Folder 4": ["Subfolder 4A", "Subfolder 4B"],
    "Folder 5": []
  };

  const [folderPath, setFolderPath] = useState([]); // Breadcrumb state
  const [filteredFolder, setFilteredFolder] = useState(null); // Dropdown filter

  // Get visible folders based on state
  let visibleFolders = Object.keys(allFolders);
  if (filteredFolder) {
    visibleFolders = [filteredFolder]; // Show only selected dropdown folder
  } else if (folderPath.length > 0) {
    const lastFolder = folderPath[folderPath.length - 1];
    visibleFolders = allFolders[lastFolder] || []; // Show subfolders
  }

  // Handle folder click (Navigates into subfolder)
  const handleFolderClick = (folder) => {
    setFolderPath([...folderPath, folder]); // Append to breadcrumb
    setFilteredFolder(null); // Reset dropdown filter
  };

  // Handle directory dropdown selection (Filters only)
  const handleDirectorySelect = (folder) => {
    setFilteredFolder(folder);
    setFolderPath([]); // Reset breadcrumb when filtering
  };

  // Handle breadcrumb navigation (Restores view)
  const handleBreadcrumbNavigate = (newPath) => {
    setFolderPath(newPath);
    setFilteredFolder(null); // Reset dropdown selection
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

          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />

          {/* Folder Grid (Shows filtered/unvisited folders) */}
          <FolderGrid folders={visibleFolders} onFolderClick={handleFolderClick} />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
