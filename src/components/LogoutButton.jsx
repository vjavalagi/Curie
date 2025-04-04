import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

export default function LogoutButton() {
  const { setUser } = useGlobal();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear context
    localStorage.removeItem("curieUser"); // Clear saved session
    navigate("/login"); // Redirect to login
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:text-red-800 underline ml-4"
    >
      Logout
    </button>
  );
}
