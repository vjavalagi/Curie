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
  const [folderPath, setFolderPath] = useState([]); // Tracks breadcrumb state
  const [filteredFolder, setFilteredFolder] = useState(null); // Stores dropdown filter selection
  const [animating, setAnimating] = useState(false); // Controls animation

  // Determines which folders to display
  const getVisibleFolders = () => {
    if (filteredFolder) return [filteredFolder]; // Show only selected dropdown folder
    if (folderPath.length > 0) return allFolders[folderPath.at(-1)] || []; // Show subfolders
    return Object.keys(allFolders); // Show root folders
  };
  const visibleFolders = getVisibleFolders();

  // Handles navigation actions with animation
  const handleNavigation = (updateFn) => {
    setAnimating(true);
    setTimeout(() => {
      updateFn();
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown 
          currentDirectory={folderPath.at(-1) || "Home"} 
          folders={filteredFolder ? [filteredFolder] : Object.keys(allFolders)} 
          onSelect={(folder) => handleNavigation(() => {
            setFilteredFolder(folder);
            setFolderPath([]); // Reset breadcrumb when filtering
          })} 
        />
        <div className="flex flex-col flex-1 items-center">
          <div className="text-center mt-6">
            <WelcomeMessage />
          </div>

          <BreadcrumbNavigation 
            path={folderPath} 
            onNavigate={(newPath) => handleNavigation(() => {
              setFolderPath(newPath);
              setFilteredFolder(null);
            })} 
          />

          <FolderGrid 
            folders={visibleFolders} 
            onFolderClick={(folder) => handleNavigation(() => {
              setFolderPath([...folderPath, folder]);
              setFilteredFolder(null);
            })} 
            animating={animating} 
          />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
