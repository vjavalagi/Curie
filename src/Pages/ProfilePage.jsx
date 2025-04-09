import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import LogoutButton from "../components/LogoutButton";
import { motion, AnimatePresence } from "framer-motion";
import PdfViewer from "../components/PdfViewer";
import Folder from "../components/Folder";
import Card from "../components/Card";
import CreateFolderModal from "../components/CreateFolderModal";
import { useGlobal } from "../context/GlobalContext";
import LogoutButton from "../components/LogoutButton";

export default function ProfilePage() {
  // Global tag & paper tag state
  const [tags, setTags] = useState([]);
   const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Filtering state
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedYearFilter, setSelectedYearFilter] = useState(null);
  const [activeAuthorFilters, setActiveAuthorFilters] = useState([]);

  // Global context values
  const {
    user,
    selectedPdf,
    fileSystem,
    setSelectedPdf,
    currentFolder,
    setCurrentFolder,
    refreshFileSystem,
  } = useGlobal();

  // A list of colors used to assign to tags
  const presetColors = [
    "#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E",
    "#14B8A6", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6",
    "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#6B7280",
    "#10B981", "#0EA5E9", "#F59E0B", "#7C3AED", "#DC2626"
  ];

  // Filtering handler functions
  const handleClickYear = (year) => {
    setSelectedYearFilter((prev) => (prev === year ? null : year));
  };

  const toggleFilterTag = (tagName) => {
    setActiveFilters((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const toggleFilterAuthor = (authorName) => {
    setActiveAuthorFilters((prev) =>
      prev.includes(authorName)
        ? prev.filter((a) => a !== authorName)
        : [...prev, authorName]
    );
  };

  // Checks if a paper (card) matches the active filter criteria
  const cardMatchesFilters = (cardTags, cardDate, cardAuthors = []) => {
    const cardYear = cardDate?.slice(0, 4);
    const tagMatch =
      activeFilters.length === 0 ||
      activeFilters.every((filter) =>
        cardTags.some((t) => t.name === filter)
      );
    const yearMatch = !selectedYearFilter || selectedYearFilter === cardYear;
    const authorMatch =
      activeAuthorFilters.length === 0 ||
      activeAuthorFilters.every((filterAuthor) =>
        cardAuthors.some((author) =>
          author.toLowerCase().includes(filterAuthor.toLowerCase())
        )
      );
    return tagMatch && yearMatch && authorMatch;
  };

  // Tag management functions
  const handleAddTag = (name) => {
    const color = presetColors[tags.length % presetColors.length];
    const newTag = { name, color };
    setTags((prev) => [...prev, newTag]);
  };

  const handleRemoveTagGlobally = async (tagName) => {
    setTags((prev) => prev.filter((t) => t.name !== tagName));
    setPdfTags((prev) => {
      const updated = {};
      Object.keys(prev).forEach((id) => {
        updated[id] = prev[id].filter((t) => t.name !== tagName);
      });
      return updated;
    });

    const removeTagRecursively = async (fs, folderName = "") => {
      for (const paper of fs.jsons) {
        if (paper.tags?.some((t) => t.name === tagName)) {
          const newTags = paper.tags.filter((t) => t.name !== tagName);
          await updatePaperTags(paper, folderName, newTags);
        }
      }
      for (const folder of fs.folders) {
        await removeTagRecursively(folder.content, folder.name);
      }
    };

    if (fileSystem) {
      await removeTagRecursively(fileSystem, "");
      refreshFileSystem();
    }
  };

  // Updates tags for a paper on the backend and then updates state accordingly
  const updatePaperTags = async (paper, folderName, newTags) => {
    try {
      const res = await axios.post("http://localhost:5001/api/update-tags", {
        username: user.UserID,
        folder: folderName,
        paper_id: paper.entry_id,
        new_tags: newTags,
      });
      const updated = res.data.updated_metadata.tags;
      setPdfTags((prev) => ({ ...prev, [paper.entry_id]: updated }));
      // Merge any new tags into the global sidebar
      setTags((prev) => {
        const existing = new Set(prev.map((t) => t.name));
        const merged = [...prev];
        updated.forEach((t) => {
          if (!existing.has(t.name)) merged.push(t);
        });
        return merged;
      });
      refreshFileSystem();
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  // Handles assigning a tag to a paper
  const handleAssignTag = (paperId, tag, folderName, paper) => {
    setPdfTags((prev) => {
      const current = prev[paperId] || [];
      if (current.some((t) => t.name === tag.name)) return prev;
      const updated = [...current, tag];
      updatePaperTags(paper, folderName, updated);
      return { ...prev, [paperId]: updated };
    });
  };

  // Handles removing a tag from a paper
  const handleRemoveTagFromCard = (paperId, tagName, folderName, paper) => {
    setPdfTags((prev) => {
      const current = prev[paperId] || [];
      const updated = current.filter((t) => t.name !== tagName);
      updatePaperTags(paper, folderName, updated);
      return { ...prev, [paperId]: updated };
    });
  };

  // Deletes a paper from the backend, then refreshes the file system view
  const handleDeletePaper = async (paper, folderName) => {
    try {
      await axios.post("http://localhost:5001/api/delete-paper", {
        username: user.UserID,
        folder: folderName,
        paper_id: paper.entry_id,
      });
      refreshFileSystem();
    } catch (error) {
      console.error("Error deleting paper:", error);
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

  // Create folder function (called when the modal form is submitted)
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await axios.post("http://localhost:5001/api/create-folder", {
        username: user.UserID,
        folder: newFolderName.trim(),
      });
      refreshFileSystem();
      setShowCreateModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Merge tags from the fileSystem into the global sidebar
  useEffect(() => {
    if (!fileSystem) return;
    const found = new Map();
    const traverse = (fs) => {
      fs.jsons.forEach((p) =>
        (p.tags || []).forEach((t) => found.set(t.name, t))
      );
      fs.folders.forEach((f) => traverse(f.content));
    };
    traverse(fileSystem);
    setTags((prev) => {
      const map = new Map(prev.map((t) => [t.name, t]));
      for (const t of found.values()) {
        if (!map.has(t.name)) map.set(t.name, t);
      }
      return Array.from(map.values());
    });
  }, [fileSystem]);

  // Initialize pdfTags from the fileSystem metadata
  useEffect(() => {
    if (!fileSystem) return;
    const out = {};
    const traverse = (fs) => {
      fs.jsons.forEach((p) => {
        out[p.entry_id] = p.tags || [];
      });
      fs.folders.forEach((f) => traverse(f.content));
    };
    traverse(fileSystem);
    setPdfTags(out);
  }, [fileSystem]);

  // Refresh the fileSystem whenever the current folder changes
  useEffect(() => {
    refreshFileSystem();
  }, [currentFolder, refreshFileSystem]);

  // Base view: folders and loose (top-level) papers, applying filters and sorting
  const renderBaseView = () => (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Folders</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          + Create Folder
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {fileSystem.folders.map((f, i) => (
          <Folder key={i} name={f.name} onOpenFolder={() => setCurrentFolder(f.name)} />
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-3">Loose Papers</h3>
      <div className="flex flex-wrap gap-6 justify-center">
        <AnimatePresence mode="popLayout">
          {[...fileSystem.jsons]
            .sort((a, b) => {
              const aTags = pdfTags[a.entry_id] || [];
              const bTags = pdfTags[b.entry_id] || [];
              const aMatch = cardMatchesFilters(aTags, a.published, a.authors);
              const bMatch = cardMatchesFilters(bTags, b.published, b.authors);
              if (aMatch && !bMatch) return -1;
              if (!aMatch && bMatch) return 1;
              return 0;
            })
            .map((paper) => {
              const current = pdfTags[paper.entry_id] || [];
              const matches = cardMatchesFilters(current, paper.published, paper.authors);
              return (
                <motion.div
                  key={paper.entry_id}
                  layout
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: matches ? 1 : 0.4 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Card
                    paperId={paper.entry_id}
                    name={paper.title}
                    authors={paper.authors}
                    date={paper.published}
                    abstract={paper.summary}
                    journal_ref={paper.journal_ref}
                    tags={current}
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

  // In-folder view: recursive rendering of folders and papers with filtering
  const renderFolderView = () => {
    const folder = fileSystem.folders.find((f) => f.name === currentFolder);
    if (!folder) return <p>Folder not found.</p>;

    const renderFileSystem = (fs, folderName = "") => (
      <div>
        {fs.folders.map((f, i) => (
          <div key={i} className="ml-4 my-2">
            <Folder name={f.name} onOpenFolder={() => setCurrentFolder(f.name)} />
            <div className="ml-6">{renderFileSystem(f.content, f.name)}</div>
          </div>
        ))}
        <AnimatePresence mode="popLayout">
          {[...fs.jsons]
            .sort((a, b) => {
              const aTags = pdfTags[a.entry_id] || [];
              const bTags = pdfTags[b.entry_id] || [];
              const aMatch = cardMatchesFilters(aTags, a.published, a.authors);
              const bMatch = cardMatchesFilters(bTags, b.published, b.authors);
              if (aMatch && !bMatch) return -1;
              if (!aMatch && bMatch) return 1;
              return 0;
            })
            .map((paper) => {
              const current = pdfTags[paper.entry_id] || [];
              const matches = cardMatchesFilters(current, paper.published, paper.authors);
              return (
                <motion.div
                  key={paper.entry_id}
                  layout
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: matches ? 1 : 0.4 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Card
                    paperId={paper.entry_id}
                    name={paper.title}
                    authors={paper.authors}
                    date={paper.published}
                    abstract={paper.summary}
                    journal_ref={paper.journal_ref}
                    tags={current}
                    availableTags={tags}
                    onAssignTag={(tag) =>
                      handleAssignTag(paper.entry_id, tag, folder.name, paper)
                    }
                    onRemoveTagFromCard={(tagName) =>
                      handleRemoveTagFromCard(paper.entry_id, tagName, folder.name, paper)
                    }
                    onDeletePaper={() => handleDeletePaper(paper, folder.name)}
                    onClickTag={toggleFilterTag}
                    activeFilters={activeFilters}
                    selectedYearFilter={selectedYearFilter}
                    onClickYear={handleClickYear}
                    activeAuthorFilters={activeAuthorFilters}
                    onClickAuthor={toggleFilterAuthor}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    );

    return (
      <>
        <button
          className="mb-4 px-4 py-2 bg-gray-300 rounded"
          onClick={() => setCurrentFolder("")}
        >
          ← Back
        </button>
        <h3 className="text-lg font-semibold mb-3">
          Contents of “{currentFolder}”
        </h3>
        {renderFileSystem(folder.content, currentFolder)}
      </>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTagGlobally}
          onClickTag={toggleFilterTag}
          activeFilters={activeFilters}
        />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation
            path={currentFolder ? [currentFolder] : []}
            onNavigate={() => setCurrentFolder("")}
          />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Saved PDFs
            </h2>
            {!fileSystem ? (
              <p className="text-center text-gray-500">Loading file system...</p>
            ) : !currentFolder ? (
              renderBaseView()
            ) : (
              renderFolderView()
            )}
          </div>
        </div>
      </div>
      <SaveGroupingButton />
      <LogoutButton />
      {selectedPdf && (
        <PdfViewer pdfUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </div>
  );
}
