import React, { useContext } from "react";
import { useGlobal } from "../context/GlobalContext";

export default function WelcomeMessage() {
  const { user } = useGlobal();

  const name = user?.UserID || "Guest";

  return (
    <h2 className="text-5xl font-bold text-blue-800 text-center">
      Welcome, {name} !👋
    </h2>
  );
}
