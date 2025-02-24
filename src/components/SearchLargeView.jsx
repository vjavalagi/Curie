import React, { useState } from "react";
import Timeline from "./Timeline";
import { useGlobal } from "./GlobalContext";

export default function SearchLargeView() {
  //const [selectedPaper, setSelectedPaper] = useState("SQL Injection");
  const { search, setSearch } = useGlobal();
  return (
    <main className="flex-1 p-4 pt-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        {/* Beginner Buttons on Left */}
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-300 text-white rounded-lg shadow-md">
            Beginner
          </button>
          <button className="px-4 py-2 bg-blue-400 text-white rounded-lg shadow-md">
            Intermediate
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
            Expert
          </button>
        </div>

        {/* Deep Dive Button on Right */}
        <button className="px-4 py-2 bg-curieBlue text-white rounded-lg shadow-md hover:bg-blue-600">
          Deep Dive ✨
        </button>
      </div>

      {/* Paper Content */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">{search}</h1>
        <h2 className="text-lg font-semibold mt-2">Summary</h2>
        <p className="text-gray-700">
          Shows an AI-generated summary of the field itself along with a
          timeline.
        </p>

        <Timeline />
      </section>
    </main>
  );
}
