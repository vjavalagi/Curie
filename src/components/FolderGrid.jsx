import React from "react";

export default function FolderGrid() {
  return (
    <div className="grid grid-cols-3 gap-16 mt-6 w-full max-w-4xl">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
          📁
        </div>
      ))}
    </div>
  );
}
