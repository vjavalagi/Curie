import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function WelcomeMessage() {
  const { user } = useContext(UserContext);

  const name = user?.UserID || "Guest";

  return (
    <h2 className="text-5xl font-bold text-blue-800 text-center">
      Welcome, {name}!
    </h2>
  );
}
