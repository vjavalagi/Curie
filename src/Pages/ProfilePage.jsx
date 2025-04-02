import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import DirectoryDropdown from "../components/DirectoryDropdown";
import SaveGroupingButton from "../components/SaveGroupingButton";
import WelcomeMessage from "../components/WelcomeMessage";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import LogoutButton from "../components/LogoutButton";
import PdfViewer from "../components/PdfViewer";
import Folder from "../components/Folder";
import Card from "../components/Card";
import { useGlobal } from "../context/GlobalContext";

export default function ProfilePage() {
  const [tags, setTags] = useState([]);
  const { 
    user, 
    selectedPdf, 
    fileSystem, 
    setSelectedPdf,
    currentFolder,
    setCurrentFolder,
    refreshFileSystem,
  } = useGlobal();
  const [pdfTags, setPdfTags] = useState({});

  const presetColors = [
    "#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E",
    "#14B8A6", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6",
    "#A855F7", "#D946EF", "#EC4899", "#F43F5E", "#6B7280",
    "#10B981", "#0EA5E9", "#F59E0B", "#7C3AED", "#DC2626"
  ];

  const handleAddTag = (name) => {
    const index = tags.length % presetColors.length;
    const newTag = { name, color: presetColors[index] };
    setTags((prev) => [...prev, newTag]);
  };

  const handleRemoveTagGlobally = async (tagName) => {
    setTags((prev) => prev.filter((t) => t.name !== tagName));
    setPdfTags((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = prev[key].filter((t) => t.name !== tagName);
      }
      return updated;
    });

    const updatePaperTagRemoval = async (fs, folderName = "") => {
      if (fs.jsons) {
        for (const paper of fs.jsons) {
          if (paper.tags && paper.tags.some((t) => t.name === tagName)) {
            const newTags = paper.tags.filter((t) => t.name !== tagName);
            await updatePaperTags(paper, folderName, newTags);
          }
        }
      }
      if (fs.folders) {
        for (const folder of fs.folders) {
          await updatePaperTagRemoval(folder.content, folder.name);
        }
      }
    };

    if (fileSystem) {
      await updatePaperTagRemoval(fileSystem, "");
      refreshFileSystem();
    }
  };

  const updatePaperTags = async (paper, folderName, newTags) => {
    try {
      const response = await axios.post("http://localhost:5001/api/update-tags", {
        username: user?.UserID,
        folder: folderName,
        paper_id: paper.entry_id,
        new_tags: newTags,
      });
      if (response.data.updated_metadata) {
        const updatedPaperTags = response.data.updated_metadata.tags;
        setPdfTags((prev) => ({
          ...prev,
          [paper.entry_id]: updatedPaperTags,
        }));
        setTags((prevTags) => {
          const existingNames = new Set(prevTags.map((t) => t.name));
          const merged = [...prevTags];
          updatedPaperTags.forEach((tag) => {
            if (!existingNames.has(tag.name)) {
              merged.push(tag);
            }
          });
          return merged;
        });
        refreshFileSystem();
      }
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  const handleAssignTag = (cardId, tag, folderName, paper) => {
    setPdfTags((prev) => {
      const currentTags = prev[cardId] || [];
      if (currentTags.some((t) => t.name === tag.name)) return prev;
      const updated = [...currentTags, tag];
      updatePaperTags(paper, folderName, updated);
      return { ...prev, [cardId]: updated };
    });
  };

  const handleRemoveTagFromCard = (cardId, tagName, folderName, paper) => {
    setPdfTags((prev) => {
      const currentTags = prev[cardId] || [];
      const updated = currentTags.filter((t) => t.name !== tagName);
      updatePaperTags(paper, folderName, updated);
      return { ...prev, [cardId]: updated };
    });
  };

  const handleDeletePaper = async (paper, folderName) => {
    try {
      const response = await axios.post("http://localhost:5001/api/delete-paper", {
        username: user?.UserID,
        folder: folderName,
        paper_id: paper.entry_id,
      });
      refreshFileSystem();
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;
    try {
      const response = await axios.post("http://localhost:5001/api/create-folder", {
        username: user?.UserID,
        folder: folderName,
      });
      refreshFileSystem();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  function renderFileSystem(fs, currentFolderName = "") {
    if (!fs) return null;
    return (
      <div>
        {fs.folders.map((folder, idx) => (
          <div key={`folder-${idx}`} className="ml-4 my-2">
            <Folder name={folder.name} />
            <div className="ml-6">
              {renderFileSystem(folder.content, folder.name)}
            </div>
          </div>
        ))}
        {fs.jsons.map((paper, idx) => {
          const currentPaperTags = pdfTags[paper.entry_id] || [];
          return (
            <div key={`paper-${paper.entry_id}-${idx}`} className="ml-4 my-2">
              <Card
                name={paper.title}
                authors={paper.authors}
                date={paper.published}
                abstract={paper.summary}
                tags={currentPaperTags}
                availableTags={tags}
                onAssignTag={(tag) =>
                  handleAssignTag(paper.entry_id, tag, currentFolderName, paper)
                }
                onRemoveTagFromCard={(tagName) =>
                  handleRemoveTagFromCard(paper.entry_id, tagName, currentFolderName, paper)
                }
                onDeletePaper={() => handleDeletePaper(paper, currentFolderName)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const renderBaseView = () => {
    if (!fileSystem) return null;
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Folders</h3>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleCreateFolder}
          >
            Create Folder
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {fileSystem.folders.map((folder, idx) => (
            <div
              key={`folder-${idx}`}
              onClick={() => setCurrentFolder(folder.name)}
              className="cursor-pointer"
            >
              <Folder name={folder.name} />
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold mt-4">Loose Papers</h3>
        <div>
          {fileSystem.jsons.map((paper, idx) => {
            const currentPaperTags = pdfTags[paper.entry_id] || [];
            return (
              <div key={`paper-${paper.entry_id}-${idx}`} className="ml-4 my-2">
                <Card
                  name={paper.title}
                  authors={paper.authors}
                  date={paper.published}
                  abstract={paper.summary}
                  tags={currentPaperTags}
                  availableTags={tags}
                  onAssignTag={(tag) =>
                    handleAssignTag(paper.entry_id, tag, "", paper)
                  }
                  onRemoveTagFromCard={(tagName) =>
                    handleRemoveTagFromCard(paper.entry_id, tagName, "", paper)
                  }
                  onDeletePaper={() => handleDeletePaper(paper, "")}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFolderView = () => {
    if (!fileSystem) return null;
    const selected = fileSystem.folders.find(
      (folder) => folder.name === currentFolder
    );
    if (!selected) return <div>Folder not found.</div>;
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
        {renderFileSystem(selected.content, currentFolder)}
      </div>
    );
  };

  useEffect(() => {
    if (fileSystem) {
      const collectedTags = new Map();
      const traverse = (fs) => {
        fs.jsons.forEach((paper) => {
          (paper.tags || []).forEach((tag) => {
            if (!collectedTags.has(tag.name)) {
              collectedTags.set(tag.name, tag);
            }
          });
        });
        fs.folders.forEach((folder) => {
          traverse(folder.content);
        });
      };
      traverse(fileSystem);
      setTags((prevTags) => {
        const tagMap = new Map(prevTags.map((t) => [t.name, t]));
        for (const [name, tag] of collectedTags.entries()) {
          if (!tagMap.has(name)) {
            tagMap.set(name, tag);
          }
        }
        return Array.from(tagMap.values());
      });
    }
  }, [fileSystem]);

  useEffect(() => {
    if (fileSystem) {
      const newPdfTags = {};
      const traverse = (fs) => {
        fs.jsons.forEach((paper) => {
          if (!newPdfTags[paper.entry_id]) {
            newPdfTags[paper.entry_id] = paper.tags || [];
          }
        });
        fs.folders.forEach((folder) => traverse(folder.content));
      };
      traverse(fileSystem);
      setPdfTags(newPdfTags);
    }
  }, [fileSystem]);

  useEffect(() => {
    refreshFileSystem();
  }, [currentFolder, refreshFileSystem]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header variant="lightblue" />
      <div className="flex flex-1 overflow-hidden">
        <DirectoryDropdown
          tags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTagGlobally}
        />
        <div className="flex flex-col flex-1 items-center pt-3 overflow-y-auto">
          <WelcomeMessage />
          <BreadcrumbNavigation path={[]} onNavigate={() => {}} />
          <div className="w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3 text-center">Saved PDFs</h2>
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
    </div>
  );
}
