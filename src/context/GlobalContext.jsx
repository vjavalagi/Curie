// GlobalContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";


const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Initialize user state from localStorage (default to "Radia" if none found)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("curieUser");
    console.log("Saved user:", savedUser);
    return savedUser ? JSON.parse(savedUser) : "Radia";
  });

  // File system state and current folder.
  const [fileSystem, setFileSystem] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("");

  // Memoize refreshFileSystem so that its reference remains stable.
  const refreshFileSystem = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-file-system`, {
        params: { username: user["UserID"] },
      });
      console.log("Refreshed file system:", response.data);
      setFileSystem(response.data);
    } catch (error) {
      console.error("Error refreshing file system:", error);
    }
  }, [user]);

  // Fetch file system when the user changes.
  useEffect(() => {
    async function fetchFileSystem() {
      try {
        const response = await axios.get("http://localhost:5001/api/get-file-system", {
          params: { username: user["UserID"] },
        });
        console.log("File system fetched:", response.data);
        setFileSystem(response.data);
      } catch (error) {
        console.error("Error fetching file system:", error);
      }
    }
    fetchFileSystem();
  }, [user]);

  // Poll the file system every 10 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Polling file system...");
      refreshFileSystem();
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshFileSystem]);

  // Save user to localStorage when user state changes.
  useEffect(() => {
    if (user) {
      localStorage.setItem("curieUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("curieUser");
    }
  }, [user]);

  // Other global states.
  const [search, setSearch] = useState("");
  const [activePaper, setActivePaper] = useState(null);
  const [activeSummary, setActiveSummary] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const updateSearch = (query) => setSearch(query);
  const updateUser = (newUser) => setUser(newUser);
  const updateActivePaper = (paper) => setActivePaper(paper);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        search,
        setSearch,
        activePaper,
        selectedPdf,
        setSelectedPdf,
        setActivePaper,
        activeSummary,
        setActiveSummary,
        updateSearch,
        updateUser,
        updateActivePaper,
        fileSystem,
        setFileSystem,
        currentFolder,
        setCurrentFolder,
        refreshFileSystem,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
