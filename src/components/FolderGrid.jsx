import React from 'react';

const FolderGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center"
        >
          <span className="text-gray-500">📁</span>
        </div>
      ))}
    </div>
  );
};

export default FolderGrid;