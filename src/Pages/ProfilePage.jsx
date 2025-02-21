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

  // State variables
  const [folderPath, setFolderPath] = useState([]);
  const [filteredFolder, setFilteredFolder] = useState(null);
  const [animating, setAnimating] = useState(false);

  // Determines visible folders
  const getVisibleFolders = () => {
    if (filteredFolder) return [filteredFolder];
    if (folderPath.length > 0) return allFolders[folderPath.at(-1)] || [];
    return Object.keys(allFolders);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown 
          currentDirectory={folderPath.at(-1) || "Home"} 
          folders={filteredFolder ? [filteredFolder] : Object.keys(allFolders)}
          onSelect={(folder) => setFilteredFolder(folder)}
        />
        <div className="flex flex-col flex-1 items-center pt-3">
          <WelcomeMessage />

          {/* Breadcrumb Navigation - Always Visible */}
          <BreadcrumbNavigation path={folderPath} onNavigate={setFolderPath} />

          {/* Folder Grid with animations */}
          <FolderGrid 
            folders={getVisibleFolders()} 
            onFolderClick={(folder) => setFolderPath([...folderPath, folder])} 
            animating={animating} 
            setAnimating={setAnimating}
          />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
