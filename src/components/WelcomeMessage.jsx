import React from "react";

export default function WelcomeMessage({ name = "Sydney" }) {
  return (
    <h2 className="text-5xl font-bold text-blue-800 text-center">
      Welcome, {name}!
    </h2>
  );
}
