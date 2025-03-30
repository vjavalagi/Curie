import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Initialize user state from localStorage (fallback default "Radia" if not found)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("curieUser");
    console.log("Saved user:", savedUser);
    return savedUser ? JSON.parse(savedUser) : "Radia";
  });

  // Initialize fileSystem state (can be an empty object, null, or a default value)
  const [fileSystem, setFileSystem] = useState(null);

  // Fetch file system from the backend when the user changes
  useEffect(() => {
    async function fetchFileSystem() {
      try {
        const response = await axios.get("http://localhost:5001/api/get-file-system", {
          params: { username: user["UserID"] }
        });
        console.log("File system:", response.data);
        setFileSystem(response.data);
      } catch (error) {
        console.error("Error fetching file system:", error);
      }
    }
    fetchFileSystem();
  }, [user]);

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("curieUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("curieUser");
    }
  }, [user]);

  // Other global states
  const [search, setSearch] = useState("");
  const [activePaper, setActivePaper] = useState(null);
  const [activeSummary, setActiveSummary] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Optional update functions (if desired)
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
        fileSystem,      // expose fileSystem in the context
        setFileSystem,   // expose setFileSystem if needed
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
