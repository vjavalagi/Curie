import React from "react";

export default function Tag({ label, color = "#E0E0E0" }) {
  return (
    <span
      className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-full text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
