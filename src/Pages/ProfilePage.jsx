import React from "react";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import FolderGrid from "../components/FolderGrid";
import SaveGroupingButton from "../components/SaveGroupingButton";

export default function ProfilePage() {
  return (
    <div className="h-screen flex flex-col">
      <Header variant = "lightblue"/>
      <div className = "w-full max-w-4xl p-4 flex flex-col items-center pt-8">
        <div className="w-full max-w-2xl text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Welcome, Sydney!</h1>
        </div>
        <DirectoryDropdown />
        <FolderGrid />
        <SaveGroupingButton />
      </div>
    </div>
  );
}