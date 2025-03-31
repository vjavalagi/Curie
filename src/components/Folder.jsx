import React, { useEffect } from "react";
import folderImage from "../assets/folder.jpg"; // adjust the path as needed
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";

const Folder = ({ name }) => {
  const { user, refreshFileSystem } = useGlobal();

  useEffect(() => {
    console.log("fileSystem updated in Folder component for folder:", name);
  }, [name]);

  const handleClick = () => {
    console.log(`Folder "${name}" was clicked!`);
    console.log("User:", user);
  };

  const handleDeleteFolder = async (e) => {
    e.stopPropagation(); // Prevent triggering folder click
    const confirmDelete = window.confirm(`Are you sure you want to delete folder "${name}"?`);
    if (!confirmDelete) return;
    try {
      const response = await axios.post("http://localhost:5001/api/delete-folder", {
        username: user["UserID"],
        folder: name,
      });
      console.log("Delete folder response:", response.data);
      // Refresh the file system so the folder is removed from the view.
      refreshFileSystem();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  return (
    <div>
      <button onClick={handleClick} className="cursor-pointer">
        <img src={folderImage} alt="Folder" style={{ width: '150px', height: '150px' }} />
        <div>{name}</div>
      </button>
      <button
        onClick={handleDeleteFolder}
        className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
      >
        Delete Folder
      </button>
    </div>
  );
};

export default Folder;
