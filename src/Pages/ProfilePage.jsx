import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";

export default function ProfilePage() {
  const [folders, setFolders] = useState(["Folder 1", "Folder 2", "Folder 3", "Folder 4", "Folder 5", "Folder 6", "yasss", "yay", "yipee"]);
  const [folderPath, setFolderPath] = useState([]); // Stores the clicked folder path

  const handleFolderClick = (folder) => {
    setFolderPath([...folderPath, folder]); // Add the clicked folder to the breadcrumb path
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown />
        <div className="flex flex-col flex-1 items-center">
          {/* Welcome Message */}
          <div className="text-center mt-6">
            <WelcomeMessage />
          </div>

          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation
            path={folderPath}
            onNavigate={setFolderPath} // Allow navigation within breadcrumb
          />

          {/* Folder Grid */}
          <FolderGrid folders={folders} onFolderClick={handleFolderClick} />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
