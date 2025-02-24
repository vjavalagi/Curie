// GlobalContext.jsx
import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("Radia")
  const [activePaper, setActivePaper] = useState();
  const updateSearch = (query) => setSearch(query);
  const updateUser = (query) => setUser(query);
  const updateActiverPaper = (query) => setActivePaper(query);
  return (
    <GlobalContext.Provider value={{ search, user, activePaper, setSearch, updateSearch, setActivePaper }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
