import React, { useState, useRef, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";

const Folder = ({ name, onOpenFolder }) => {
  const { user, refreshFileSystem, setCurrentFolder } = useGlobal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      await axios.post("http://localhost:5001/api/delete-folder", {
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
      {/* Folder Content */}
      <div className="flex items-center w-full pr-10 pl-4 py-2">
        <div
          onClick={(e) => {
            e.stopPropagation(); // just in case
            if (!menuOpen && !showModal) {
              onOpenFolder();
            }
          }}
          className="flex items-center gap-2 cursor-pointer flex-1"
        >

          {/* Folder Icon */}
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
          <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
  
        {/* Kebab menu */}
        <div ref={menuRef} className="relative z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded hover:bg-gray-300"
          >
            {/* Vertical Kebab Icon */}
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
  
          {/* Trash menu dropdown */}
          {menuOpen && (
            <div className="absolute left-full top-0 ml-2 bg-white border border-gray-200 rounded shadow-md p-1 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  setShowModal(true);
                }}
                className="p-2 hover:bg-red-100 rounded text-red-600"
                aria-label="Delete Folder"
              >
                {/* Trash Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Delete Modal (unchanged) */}
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
    </div>
  );
  
};

export default Folder;
