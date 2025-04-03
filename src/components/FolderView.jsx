import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import { useGlobal } from "../context/GlobalContext";

export default function FolderView() {
  const {
    fileSystem,
    currentFolder,
    setCurrentFolder,
    refreshFileSystem,
  } = useGlobal();

  const selected = fileSystem?.folders.find(
    (folder) => folder.name === currentFolder
  );

  if (!selected) return <div>Folder not found.</div>;

  const papers = selected.content.jsons;

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
                  name={paper.title}
                  authors={paper.authors}
                  date={paper.published}
                  abstract={paper.summary}
                  tags={paper.tags || []}
                  availableTags={[]}
                  onAssignTag={() => {}}
                  onRemoveTagFromCard={() => {}}
                  onDeletePaper={() => {}}
                  onClickTag={() => {}}
                  activeFilters={[]}
                  selectedYearFilter={null}
                  onClickYear={() => {}}
                  activeAuthorFilters={[]}
                  onClickAuthor={() => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
