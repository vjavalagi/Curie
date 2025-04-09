import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import WelcomeMessage from "../components/WelcomeMessage";
import LogoutButton from "../components/LogoutButton";
import { motion, AnimatePresence } from "framer-motion";
import PdfViewer from "../components/PdfViewer";
import Folder from "../components/Folder";
import Card from "../components/Card";
import CreateFolderModal from "../components/CreateFolderModal";
import FolderView from "../components/FolderView";
import { useGlobal } from "../context/GlobalContext";
import LogoutButton from "../components/LogoutButton";

export default function ProfilePage() {
  const [tags, setTags] = useState([]);
   const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const {
    user,
    selectedPdf,
    fileSystem,
    setSelectedPdf,
    currentFolder,
    setCurrentFolder,
    refreshFileSystem,
    setFileSystem,
  } = useGlobal();
  const [pdfTags, setPdfTags] = useState({});

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await axios.post("http://localhost:5001/api/create-folder", {
        username: user?.UserID,
        folder: newFolderName.trim(),
      });
      refreshFileSystem();
      setShowCreateModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleDeletePaper = async (paperId) => {
    const folder = currentFolder || "Loose Papers";
  
    try {
      const updatedFileSystem = { ...fileSystem };
  
      if (folder === "Loose Papers") {
        // Remove from top-level loose papers
        updatedFileSystem.jsons = (updatedFileSystem.jsons || []).filter(
          (paper) => paper.entry_id !== paperId
        );
      } else {
        // Find the folder by name
        const folderIndex = updatedFileSystem.folders.findIndex(
          (f) => f.name === folder
        );
  
        if (folderIndex !== -1) {
          const folderContent = updatedFileSystem.folders[folderIndex].content;
          folderContent.jsons = (folderContent.jsons || []).filter(
            (paper) => paper.entry_id !== paperId
          );
        } else {
          console.warn(`Folder "${folder}" not found.`);
        }
      }
  
      // Update local state
      setFileSystem(updatedFileSystem);
  
      // Update backend
      const payload = {
        username: user.UserID,
        paper_id: paperId,
      };
      
      if (folder !== "Loose Papers") {
        payload.folder = folder;
      }
      
      await axios.post("http://localhost:5001/api/delete-paper", payload);
      
    } catch (err) {
      console.error("Error deleting paper:", err);
    }
  };

  const handleMovePaper = async (paperId, fromFolder, toFolder) => {
    try {
      await axios.post("http://localhost:5001/api/move-paper", {
        username: user.UserID,
        paper_id: paperId,
        from_folder: fromFolder,
        to_folder: toFolder,
      },{
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      refreshFileSystem(); 
    } catch (err) {
      console.error("Error moving paper:", err);
    }
  };  

  const renderBaseView = () => {
    if (!fileSystem) return null;
    return (
      <>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Folders</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            aria-label="Create Folder"
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
              className="lucide lucide-folder-plus-icon"
            >
              <path d="M12 10v6" />
              <path d="M9 13h6" />
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            </svg>
            <span className="text-sm font-medium">Create Folder</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {fileSystem.folders.map((folder, idx) => (
            <Folder
              key={`folder-${idx}`}
              name={folder.name}
              onOpenFolder={() => setCurrentFolder(folder.name)}
            />
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-4">Loose Papers</h3>
        <div className="flex flex-wrap gap-6 justify-center">
          <AnimatePresence mode="popLayout">
            {[...fileSystem.jsons].map((paper, idx) => {
              const currentTags = pdfTags[paper.entry_id] || [];
              return (
                
                <motion.div
                  key={`paper-${paper.entry_id}-${idx}`}
                  layout
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  exit={{ x: 50, opacity: 0 }}
                >
                  <Card
                    paperId={paper.entry_id}
                    name={paper.title}
                    authors={paper.authors}
                    date={paper.published}
                    abstract={paper.summary}
                    journal_ref={paper.journal_ref}
                    tags={currentTags}
                    availableTags={tags}
                    links={paper.pdf_url} 
                    onAssignTag={() => {}}
                    onRemoveTagFromCard={() => {}}
                    onDeletePaper={handleDeletePaper} 
                    onClickTag={() => {}}
                    activeFilters={[]}
                    selectedYearFilter={null}
                    onClickYear={() => {}}
                    activeAuthorFilters={[]}
                    onClickAuthor={() => {}}
                    onMovePaper={handleMovePaper}
                    folders={fileSystem.folders}
                  />

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {showCreateModal && (
          <CreateFolderModal
            onCreate={handleCreateFolder}
            onClose={() => {
              setShowCreateModal(false);
              setNewFolderName("");
            }}
            folderName={newFolderName}
            setFolderName={setNewFolderName}
          />
        )}
      </>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown
          tags={tags}
          onAddTag={() => {}}
          onRemoveTag={() => {}}
          onClickTag={() => {}}
          activeFilters={[]}
        />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>
            {!fileSystem ? (
              <p className="text-center text-gray-500">Loading file system...</p>
            ) : !currentFolder ? (
              renderBaseView()
            ) : (
              <FolderView />
            )}
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
} 
