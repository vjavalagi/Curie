// GlobalContext.jsx
import { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("Radia")
  const updateSearch = (query) => setSearch(query);
  const updateUser = (query) => setUser(query);

  return (
    <GlobalContext.Provider value={{ search, setSearch, updateSearch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
