import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";


export default function FolderView() {
  const {
    fileSystem,
    currentFolder,
    setCurrentFolder,
    refreshFileSystem,
    setFileSystem,
    currentTags,
    tags, 
    user,
  } = useGlobal();

  const selected = fileSystem?.folders.find(
    (folder) => folder.name === currentFolder
  );

  if (!selected) return <div>Folder not found.</div>;

  const papers = selected.content.jsons;

  const handleDeletePaper = async (paperId) => {
    const folder = currentFolder;
    console.log("Deleting paper with ID:", paperId);
    console.log("Current folder:", folder);
  
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
        folder: folder,
        paper_id: paperId,
      };
      
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
      });

      refreshFileSystem(); 

    } catch (err) {
      console.error("Error moving paper:", err);
    }
  };
  

  return (
    <div>
      <button
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
        onClick={() => setCurrentFolder("")}
      >
        Back
      </button>

      <h3 className="text-lg font-semibold mb-3">
        Contents of {currentFolder}
      </h3>

      {papers.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="mb-4">This folder is empty.</p>
          <button
            onClick={() => setCurrentFolder("")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Import a Paper
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          <AnimatePresence mode="popLayout">
            {papers.map((paper, idx) => (
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
                  currentFolder={currentFolder}
                  activeAuthorFilters={[]}
                  onClickAuthor={() => {}}
                  onMovePaper={(paperId, toFolder) => handleMovePaper(paperId, currentFolder, toFolder)} 
                  folders={fileSystem.folders}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
