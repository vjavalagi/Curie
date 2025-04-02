import React, { useState } from "react";

export default function SaveToProfileModal({ fileSystem, onFolderSelect, onClose }) {
  const [creatingNewFolder, setCreatingNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [tempFolders, setTempFolders] = useState([]); // Newly created folders

  const handleCreateFolder = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    const alreadyExists = [...(fileSystem?.folders || []), ...tempFolders].some(
      (f) => f.name === trimmed
    );
    if (alreadyExists) {
      alert("Folder already exists.");
      return;
    }

    setTempFolders((prev) => [...prev, { name: trimmed }]);
    setNewFolderName("");
    setCreatingNewFolder(false);
  };

  const allFolders = [...(fileSystem?.folders || []), ...tempFolders];

  return (
    <div
      className="hs-overlay hs-overlay-open:mt-7 fixed left-0 top-0 z-[60] flex h-full w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50 px-4 py-5 sm:px-6 sm:py-10"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto w-full max-w-md bg-white shadow-lg rounded-xl transition-all duration-300 transform">
        <div className="relative p-6 sm:p-7 flex flex-col gap-4 h-[32rem]">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-2 right-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">Save to Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Select or create a folder to organize your paper</p>
          </div>

          {/* Scrollable Folder List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {allFolders.length > 0 ? (
              allFolders.map((folder, idx) => (
                <button
                  key={folder.name + idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left w-full"
                  onClick={() => onFolderSelect(folder.name)}
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6.75A2.25 2.25 0 015.25 4.5h3.38a2.25 2.25 0 011.59.659l.742.742h7.538A2.25 2.25 0 0121 8.151v9.099a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25V7.5z" />
                  </svg>
                  {folder.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">No folders available.</p>
            )}
          </div>

          {/* Sticky Actions */}
          <div className="flex flex-col gap-2 border-t pt-4">
            {/* New Folder Creation */}
            {creatingNewFolder ? (
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <input
                  type="text"
                  className="flex-1 text-sm px-2 py-1 border-b border-gray-300 focus:outline-none"
                  placeholder="New folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                  autoFocus
                />
                <button
                    className="inline-flex items-center justify-center px-2 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition"
                    onClick={handleCreateFolder}
                    title="Create folder"
                    >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    </button>

              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-purple-600 hover:bg-gray-50 transition text-left w-full"
                onClick={() => setCreatingNewFolder(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create New Folder
              </button>
            )}

            {/* Save as Loose File */}
            <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-left w-full"
            onClick={() => {
                onFolderSelect("");
                onClose();
            }}
            >
            <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2.25-12H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5z"
                />
            </svg>
            Save as Loose File
            </button>

          </div>

          {/* Cancel Button */}
          <div>
            <button
              type="button"
              className="w-full py-2 px-4 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition mt-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
