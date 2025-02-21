import React, { useState } from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";

export default function ProfilePage() {
  const [folders, setFolders] = useState(["Folder 1", "Folder 2", "Folder 3", "Folder 4", "Folder 5", "Folder 6", "yasss", "yay", "yipee"]); // Dummy folder names

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <div>
          <DirectoryDropdown />
        </div>
        <div className="flex flex-col flex-1 items-center">
          {/* Center the WelcomeMessage at the top */}
          <div className="text-center mt-6">
            <WelcomeMessage />
          </div>
          
          <FolderGrid folders={folders} />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
