import React from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

export default function LogoutButton() {
  const { setUser } = useGlobal();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear context
    localStorage.removeItem("curieUser"); // Clear saved session
    navigate("/"); // Redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-800 focus:outline-hidden focus:bg-red-100 dark:text-red-400 dark:hover:bg-neutral-700 dark:hover:text-red-300 dark:focus:bg-neutral-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
      Logout
    </button>
  );
}
