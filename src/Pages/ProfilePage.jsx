import React from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";

export default function ProfilePage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1">
        <div className="w-1/4 p-4">
          <DirectoryDropdown />
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <WelcomeMessage />
          <FolderGrid />
        </div>
      </div>
      <SaveGroupingButton />
    </div>
  );
}
