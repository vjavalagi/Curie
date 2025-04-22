import React, { useState, useRef, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import RenameFolderModal from "./RenameFolderModal";
import axios from "axios";

const Folder = ({ name, onOpenFolder }) => {
  const { user, refreshFileSystem, setCurrentFolder } = useGlobal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState(name);

  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteFolder = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/delete-folder`, {
        username: user["UserID"],
        folder: name,
      });
      refreshFileSystem();
    } catch (error) {
      console.error("Error deleting folder:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="relative w-full max-w-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition">
      <div className="flex items-center justify-between w-full px-4 py-2">
        {/* Folder icon + name (left-aligned and clickable) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!menuOpen && !showModal) {
              onOpenFolder();
            }
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>
          <span
            className="text-sm font-medium text-gray-800 truncate max-w-[260px]"
            title={name}
          >
            {name.length > 30 ? name.slice(0, 30) + "…" : name}
          </span>
        </div>

        {/* Kebab menu (far right of card) */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-gray-600"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
  
          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-20 w-40">
            {/* Rename Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                setShowRenameModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-gray-100 text-gray-700"
            >
              {/* Pencil Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Rename
            </button>

          
            {/* Delete Option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-red-100 text-red-600"
            >
              {/* Trash Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete
            </button>
          </div>
          
          
          )}
        </div>
      </div>
  
      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Delete Folder?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the folder <strong>{name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showRenameModal && (
        <RenameFolderModal
          name={name}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          onCancel={() => {
            setShowRenameModal(false);
            setNewFolderName(name);
          }}
          onRename={async () => {
            try {
              if (!newFolderName.trim() || newFolderName === name) return;

              await axios.post(`${API_BASE_URL}/api/rename-folder`, {
                username: user.UserID,
                oldFolderName: name,
                newFolderName: newFolderName.trim(),
              });

              refreshFileSystem();
              setShowRenameModal(false);
            } catch (error) {
              console.error("Error renaming folder:", error);
            }
          }}
        />
      )}


    </div>
  );
  
};

export default Folder;
