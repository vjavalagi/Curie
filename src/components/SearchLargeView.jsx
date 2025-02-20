import React, { useState } from "react";
import Timeline from "./Timeline";

export default function SearchLargeView() {
  const [selectedPaper, setSelectedPaper] = useState("SQL Injection");

  return (
    <main className="flex-1 p-6 pt-12 overflow-auto">
        <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-curieBlue text-white rounded-lg shadow-md hover:bg-blue-600">
          Deep Dive ✨
        </button>
        </div>

      {/* Paper Content */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">{selectedPaper}</h1>
        <h2 className="text-lg font-semibold mt-2">Summary</h2>
        <p className="text-gray-700">
          Shows an AI-generated summary of the field itself along with a timeline.
        </p>
      
      <Timeline />
      </section>
    </main>
  );
}
