import React from "react";
import { FolderIcon } from "@heroicons/react/24/solid";

export default function FolderGrid({ folders = [], onFolderClick, animating, setAnimating }) {
  const handleFolderClick = (folder) => {
    setAnimating(true);
    setTimeout(() => {
      onFolderClick(folder);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-6 mt-6 w-full px-4">
      {folders.length > 0 ? (
        folders.map((folder, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center hover:opacity-80 transition ${
              animating ? "animate-slide-out" : "animate-fade-in"
            }`}
            onClick={() => handleFolderClick(folder)}
          >
            <FolderIcon className="w-32 h-32 text-gray-400" />
            <span className="mt-1 text-sm font-medium">{folder}</span>
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-center w-full animate-fade-in">No Folders Available</p>
      )}
    </div>
  );
}
